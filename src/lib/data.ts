import { PersonalInfo, Project, Experience, TechStack, ContactInfo } from '@/types';

export const personalInfo: PersonalInfo = {
  name: "Christopher Yun",
  title: "Full Stack Developer",
  bio: "Full-stack developer with experience building scalable, cloud-native systems, and reverse-engineering complex web infrastructure. I thrive on solving difficult technical problems, building impactful software, and continuously learning new technologies.",
  location: "Chantilly, VA",
  yearsOfExperience: 5,
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
      "java", "sql", "ruby", "rust", "ocaml", "c++", "kotlin"
    ]
  },
  {
    category: "backend",
    technologies: [
      "node.js", "express", "flask", "django", "graphql", "rest-apis",
      "redis", "mongodb", "mysql", "postgres", "gRPC", "oauth"
    ]
  },
  {
    category: "frontend",
    technologies: [
      "react", "next.js", "typescript", "webpack", "scss", "html", "css"
    ]
  },
  {
    category: "services",
    technologies: [
      "aws", "firebase", "docker", "jenkins", "ci/cd", "linux", "opencv",
      "tensorflow", "keras", "jira", "notion", "confluence", "figma"
    ]
  }
];

export const projects: Project[] = [
    {
        id: "terminal-portfolio",
        name: "Terminal Portfolio Website", 
        description: "An interactive terminal-themed developer portfolio that simulates authentic command-line interactions. Users scroll to trigger sequential command executions, creating an immersive terminal experience.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React"],
        githubUrl: "https://github.com/builtbycyun/terminal-portfolio",
        liveUrl: "https://builtbycyun.github.io",
        features: [
            "Scroll-triggered command execution system",
            "Mobile-responsive design with touch support", 
            "Dynamic content rendering with HTML parsing",
            "Custom scroll behavior for seamless user experience",
            "Modular React architecture with custom hooks",
            "Real-time terminal simulation with loading states"
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
    }
];

export const experience: Experience[] = [
  {
    id: "aws-intern",
    company: "Amazon Web Services",
    position: "Software Development Engineering Intern",
    duration: "June 2024 – Aug. 2024",
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

export const terminalCommands = [
  { command: "whoami", description: "Display current user information" },
  { command: "cat about_me.txt", description: "Display personal information" },
  { command: "ls skills/", description: "List technical skills and expertise" },
  { command: "cd projects/ && ls -la", description: "Navigate to and list all projects" },
  { command: "cat experience.log", description: "Display work experience history" },
  { command: "curl -X GET /contact", description: "Fetch contact information" },
  { command: "grep -r 'ecommerce' ~/", description: "Search for ecommerce-related contributions" },
  { command: "ps aux | grep reverse-engineering", description: "Find running reverse engineering processes" }
];
