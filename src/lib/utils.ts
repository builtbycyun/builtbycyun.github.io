import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const generatePrompt = (path: string = '~'): string => {
  return `user@portfolio:${path}$`;
};

export const createAsciiArt = (text: string): string => {
  // Simple ASCII art generator for headers
  const asciiMap: { [key: string]: string[] } = {
    'ABOUT': [
      ' █████╗ ██████╗  ██████╗ ██╗   ██╗████████╗',
      '██╔══██╗██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝',
      '███████║██████╔╝██║   ██║██║   ██║   ██║   ',
      '██╔══██║██╔══██╗██║   ██║██║   ██║   ██║   ',
      '██║  ██║██████╔╝╚██████╔╝╚██████╔╝   ██║   ',
      '╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝    ╚═╝   '
    ],
    'PROJECTS': [
      '██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗',
      '██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝',
      '██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗',
      '██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║',
      '██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║',
      '╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝'
    ],
    'CONTACT': [
      ' ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗',
      '██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝',
      '██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   ',
      '██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   ',
      '╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   ',
      ' ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝   '
    ]
  };

  return asciiMap[text.toUpperCase()] ? asciiMap[text.toUpperCase()].join('\n') : text;
};

export const typewriterEffect = async (
  element: HTMLElement,
  text: string,
  speed: number = 50
): Promise<void> => {
  element.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    element.innerHTML += text.charAt(i);
    await sleep(speed);
  }
};