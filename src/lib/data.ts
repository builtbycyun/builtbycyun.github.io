import { PersonalInfo, Project, Experience, TechStack, ContactInfo } from '@/types';

export const personalInfo: PersonalInfo = {
  name: "Christopher Yun",
  title: "Full Stack Developer",
  bio: "Full-stack developer with experience building scalable, cloud-native systems, and reverse-engineering complex web infrastructure. I thrive on solving difficult technical problems, building impactful software, and continuously learning new technologies.",
  location: "Chantilly, VA",
  yearsOfExperience: 6,
  specialties: [
    "Full-Stack Engineering",
    "Cloud-Native Architecture",
    "Reverse Engineering"
  ]
};

export const techStack: TechStack[] = [
  {
    category: "languages",
    technologies: [
      "html", "css", "javascript", "typescript", "python", "go",
      "java", "sql", "ruby", "rust", "ocaml", "c++", "kotlin", "bash"
    ]
  },
  {
    category: "backend",
    technologies: [
      "node.js", "express", "flask", "fastapi", "django", "graphql", "rest-apis",
      "websockets", "socket.io", "redis", "mongodb", "mysql", "postgres",
      "gRPC", "oauth", "jwt", "pytest"
    ]
  },
  {
    category: "frontend",
    technologies: [
      "react", "next.js", "vite", "typescript", "webpack", "tailwind", "scss",
      "html", "css", "react native", "expo", "electron"
    ]
  },
  {
    category: "services",
    technologies: [
      "aws", "aws lambda", "dynamodb", "api gateway", "appsync", "s3",
      "claude api", "openai api", "llm agents", "agent evals",
      "firebase", "docker", "github actions", "jenkins", "ci/cd", "render",
      "linux", "opencv", "tensorflow", "keras",
      "jira", "notion", "confluence", "figma"
    ]
  }
];

export const projects: Project[] = [
    {
        id: "journeyman",
        name: "Journeyman",
        description: "An open-source Python library that turns any agent into a self-learning system. It traces every run, turns user feedback into lessons, and feeds them back into the agent — but a lesson only survives if your eval suite still passes. Two lines of integration code.",
        technologies: ["Python", "FastAPI", "Go", "TypeScript", "SQLite", "Claude API", "OpenAI API"],
        githubUrl: "https://github.com/builtbycyun/journeyman-agents",
        features: [
            "The eval gate: a learned change only stays live if the suite's pass-rate holds, and rolls back automatically when it doesn't",
            "One decorator captures the whole run — inputs, outputs, tool calls, LLM calls, tokens, cost, latency, errors",
            "Long-term memory assembled from the agent's own experience plus your docs, with no code to write",
            "Eval suites in YAML, seven scorer types including LLM-as-judge, and full run history",
            "Runs entirely offline on built-in heuristics; add an API key and the same pipeline upgrades to LLM-powered learning and real embeddings",
            "Embedded SQLite by default, or an HTTP server so other processes and languages can ship traces to it"
        ]
    },
    {
        id: "priors",
        name: "Priors",
        description: "A causal knowledge graph of the market for retail traders. An LLM proposes multi-hop causal links from the news (Strait of Hormuz closes → oil shortage → US corn prices); statistics validate them against historical price data. Only what survives becomes a signal.",
        technologies: ["Python", "TypeScript", "Go", "PostgreSQL", "Docker", "Claude API"],
        githubUrl: "Available upon request", // private (quantgraph/priors)
        features: [
            "LLM proposes causal hypotheses; statistical validation decides what becomes a signal",
            "Directional, confidence-rated signals that explain why a price should move",
            "Explorable causal graph linking news, events, and market vehicles",
            "Multi-user SaaS: Go edge with managed auth (WorkOS), per-user tenancy via Postgres RLS",
            "Heavy analysis runs once globally — every user is a cheap read over the shared graph"
        ]
    },
    {
        id: "auctionball",
        name: "Auctionball",
        description: "Head-to-head all-eras basketball auction game: two players bid to draft a 5-man squad from the all-time greats, then a chemistry-aware simulator decides the winner. Live in production.",
        technologies: ["TypeScript", "Node.js", "WebSockets", "Vite", "PostgreSQL", "Render"],
        githubUrl: "Available upon request", // private
        liveUrl: "https://auctionball.xyz",
        features: [
            "Possession-based, spatially-aware Monte-Carlo simulator — deterministic per seed for replays",
            "Synergy engine: team fit (spacing, playmaking, switchability) beats raw star power >60% of the time",
            "Calibrated against real NBA stat distributions over 500-game runs",
            "WebSocket matchmaking with bot fallback, reconnects, and a daily win-streak leaderboard",
            "Mode-agnostic platform: new game modes plug in an asset pool, rules, simulator, and renderer"
        ]
    },
    {
        id: "pokernow-ai",
        name: "PokerNow AI",
        description: "An AI poker bot that plays live on PokerNow.com with Claude as its decision engine — plus a self-learning loop that rewrites its own strategy files after every hand.",
        technologies: ["Python", "Flask", "Claude API", "WebSockets", "SocketIO"],
        githubUrl: "https://github.com/builtbycyun/pokernow-ai",
        features: [
            "Speaks PokerNow's WebSocket protocol directly: live game state via delta merging",
            "Deterministic hand analysis feeding compact JSON prompts to Claude",
            "Post-hand reviewer (Claude Opus) selectively updates evolving strategy files",
            "Multi-bot self-play training — three bots seated in the same game",
            "Real-time cyberpunk table UI showing the AI's reasoning and opponent hand predictions"
        ]
    },
    {
        id: "vesta-technologies",
        name: "Vesta Technologies LLC",
        description: "A SaaS automation platform designed to purchase high-demand products during releases. Included anti-bot evasion, user-facing dashboard, and advanced backend systems.",
        technologies: ["React", "Python", "Go", "JavaScript", "MongoDB", "MySQL", "AWS"],
        githubUrl: "Available upon request", // Private business project
        features: [
            "Scalable backend microservices with AWS",
            "Proprietary Akamai WAF bypass system",
            "Neural network for mouse telemetry simulation",
            "$500K+ product value processed with $150K+ user profit",
            "Custom TLS clients and human behavior simulation"
        ]
    },
    {
        id: "balloons-turret",
        name: "Balloons: Bitcamp Hackathon 2022 Winner",
        description: "An Arduino-powered turret capable of intercepting flying objects using real-time computer vision and trajectory prediction.",
        technologies: ["C++", "Python", "OpenCV", "PySerial"],
        githubUrl: "", // Add if available
        liveUrl: "https://devpost.com/software/balloons",
        features: [
            "Object tracking via OpenCV",
            "Projectile prediction using regression models",
            "Arduino turret control via serial communication",
            "Winner of MLH Special Recognition + Most Entertaining",
            "Fully automated launch system"
        ]
    },
    {
        id: "recaptcha-token-harvester",
        name: "Recaptcha V2/V3 Token Generator",
        description: "A proof-of-concept system that automatically solves Recaptcha puzzles and stores usable tokens for future bot actions.",
        technologies: ["Electron.js", "Flask", "HTML5", "CSS3", "Python"],
        githubUrl: "https://github.com/builtbycyun/Recaptcha-Harvesters",
        features: [
            "Interception of captcha challenges using Electron",
            "Flask API for token management and storage",
            "Support for Recaptcha V2 and V3",
            "Compatible across different target websites",
            "Multi-threaded and distributed harvester support"
        ]
    },
    {
        id: "portfolio",
        name: "This Page",
        description: "The thing you're reading. A portfolio that pretends to be a Claude Code session: scroll to send the next prompt, watch the agent read files and answer, then take the prompt yourself and ask it anything.",
        technologies: ["Next.js", "TypeScript", "React", "CSS"],
        githubUrl: "https://github.com/builtbycyun/builtbycyun.github.io",
        liveUrl: "https://builtbycyun.github.io",
        features: [
            "Scroll-driven transcript — each gesture sends the next prompt",
            "Simulated tool calls (Read, Glob, Bash, Task, Fetch) with streaming results",
            "Live prompt after the tour: slash commands plus free-text search over the content",
            "Esc interrupts the animation, exactly like the real thing",
            "Static export, no backend, deployed straight to GitHub Pages"
        ]
    }
];

export const experience: Experience[] = [
  {
    id: "samsara",
    company: "Samsara",
    position: "Software Engineer",
    duration: "Aug. 2025 – Present",
    description: "Building the LLM code-review system for a large engineering monorepo, and the deploy tooling engineers reach for when production is on fire.",
    achievements: [
      "Built an LLM PR review and auto-approval system that now merges 35% of all PRs with no human reviewer — removing review wait as a bottleneck for a third of the org's code changes",
      "Designed an agentic evaluation harness: curated datasets replaying real production PRs against configurable agent backends, to measure and raise review quality",
      "Kept automation safe as coverage grew with deterministic guardrails — code-coverage checks, high-risk auto-approval alerting, per-team human-approval policies",
      "Took the bot from a pilot allowlist to every PR in the organization by closing trust gaps: whole-file review context, cross-push deduplication of repeat findings, severity-tiered annotations, and a reaction-based feedback loop from engineers",
      "Shipped an emergency deployment workflow end-to-end on the internal deploy platform — non-mainline branch builds and one-click rollback for blocked or failed pipelines — cutting time-to-mitigate during incidents"
    ],
    technologies: ["Go", "GraphQL", "React", "TypeScript", "LLM Agents", "CI/CD"]
  },
  {
    id: "aws-intern",
    company: "Amazon Web Services",
    position: "Software Development Engineering Intern",
    duration: "Jun. 2024 – Aug. 2024",
    description: "Improved resource efficiency and built customer-facing analytics tools at AWS for distributed compute services.",
    achievements: [
      "Reduced idle resource usage by 20% via automated detection and reclamation tool",
      "Built reporting UI with React and AWS data APIs",
      "Deployed scalable serverless infra with Lambda, DynamoDB, API Gateway",
      "Used CI/CD pipelines to support rapid iteration"
    ],
    technologies: ["React", "AWS Lambda", "DynamoDB", "API Gateway"]
  },
  {
    id: "brivo-intern",
    company: "Brivo Inc.",
    position: "Backend Software Engineering Intern",
    duration: "May 2022 – Aug. 2022",
    description: "Worked on performance and architectural improvements for a cloud-native GraphQL platform.",
    achievements: [
      "Refactored GraphQL system using AWS AppSync, Lambda, DynamoDB",
      "Improved Node.js API latency by 44% with Redis caching and optimization",
      "Ensured backwards compatibility during system migration"
    ],
    technologies: ["Node.js", "GraphQL", "AWS AppSync", "Redis", "Elastic Beanstalk"]
  },
  {
    id: "vesta-founder",
    company: "Vesta Technologies LLC",
    position: "Founder / Fullstack Developer",
    duration: "Aug. 2020 – May 2022",
    description: "Led a software team building e-commerce automation tools and developed anti-bot evasion technologies.",
    achievements: [
      "Generated $500K+ revenue by streamlining e-commerce checkout automation",
      "Reverse engineered Akamai WAF & simulated human traffic",
      "Created neural network for mouse movement fingerprinting (98% accuracy)",
      "Built scalable AWS microservices backend"
    ],
    technologies: ["Python", "Go", "React.js", "AWS", "TensorFlow", "Express"]
  },
  {
    id: "caci-intern",
    company: "CACI Inc.",
    position: "Software Engineering Intern",
    duration: "May 2019 – Aug. 2020",
    description: "Contributed to space systems software for hardware monitoring and control.",
    achievements: [
      "Built GUI using Ruby + Qt to control space hardware systems",
      "Developed command-line monitoring tool in Python using TCP/UDP",
      "Integrated real-time data visualization for live telemetry"
    ],
    technologies: ["Ruby", "Qt", "Python", "TCP", "UDP"]
  }
];

export const contactInfo: ContactInfo = {
  email: "cyunsoftware@gmail.com",
  github: "https://github.com/builtbycyun",
  linkedin: "https://linkedin.com/in/christopheryun",
  website: "https://builtbycyun.github.io",
  location: "Chantilly, VA"
};
