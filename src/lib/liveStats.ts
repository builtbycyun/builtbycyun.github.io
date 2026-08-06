// Live stats scraped from deployed projects. Fetched once at page load;
// the terminal prints whatever has arrived by the time the section runs.

let auctionballGames: number | null = null;

export function getAuctionballGames(): number | null {
  return auctionballGames;
}

/**
 * Ask the live Auctionball server for its lifetime games-played counter.
 * The lobby handshake pushes it right after hello: connect, say hello,
 * read the one message we care about, hang up.
 */
export function fetchAuctionballGames(): void {
  if (typeof window === 'undefined' || auctionballGames !== null) return;
  try {
    const ws = new WebSocket('wss://auctionball.xyz');
    const timer = setTimeout(() => {
      try { ws.close(); } catch { /* already closed */ }
    }, 12000);
    ws.onopen = () =>
      // Fixed token so repeat visits don't inflate Auctionball's unique-user metrics
      ws.send(JSON.stringify({ t: 'hello', name: 'portfolio', token: 'portfolio-stats-probe' }));
    ws.onmessage = event => {
      try {
        const msg = JSON.parse(String(event.data));
        if (msg.t === 'gamesPlayed' && typeof msg.total === 'number') {
          auctionballGames = msg.total;
          clearTimeout(timer);
          ws.close();
        }
      } catch { /* ignore non-JSON frames */ }
    };
    ws.onerror = () => {
      clearTimeout(timer);
      try { ws.close(); } catch { /* already closed */ }
    };
  } catch {
    // The stat is optional — the projects section just omits the live line.
  }
}
