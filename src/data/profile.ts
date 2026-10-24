// Everything the site says about Rafiul, in one place. Sourced from the
// résumé and the GitHub repositories — no placeholder content.

export const profile = {
  name: "Khandaker Rafiul Islam",
  first: "Rafiul",
  role: "Full-Stack Developer",
  city: "Dhaka, Bangladesh",
  email: "rafiul.islam.khandaker@gmail.com",
  phone: "+880 1311 183481",
  phoneHref: "tel:+8801311183481",
  whatsapp: "https://wa.me/8801311183481",
  github: "https://github.com/rafi0112",
  linkedin: "https://www.linkedin.com/in/khandaker-rafiul-islam-6b80882b2/",
  resume: "/resume.pdf",
  resumeName: "Khandaker_Rafiul_Islam_Resume.pdf",
  maps: "https://maps.google.com/?q=Dhaka,Bangladesh",
};

export type ToolGroup = "Languages" | "Frontend" | "Backend" | "Data" | "DevOps" | "AI";

export interface Tool {
  name: string;
  mark: string; // monogram on the tile
  group: ToolGroup;
  /** Project ids (see projects.ts) where this tool was used. */
  used?: string[];
  note?: string;
}

// The tiles in the toolkit window. `used` links each tool to real projects.
export const tools: Tool[] = [
  { name: "TypeScript", mark: "TS", group: "Languages", used: ["oi-tesla-pool", "nestmate", "krishikonnect"] },
  { name: "JavaScript", mark: "JS", group: "Languages", used: ["bswa", "news-scraper"] },
  { name: "Python", mark: "Py", group: "Languages", used: ["gravity-cloud", "news-scraper"] },
  { name: "Go", mark: "Go", group: "Languages", used: ["bswa"] },
  { name: "C++", mark: "C+", group: "Languages", note: "Data structures, algorithms and competitive programming." },
  { name: "SQL", mark: "SQ", group: "Languages", used: ["oi-tesla-pool", "bswa", "news-scraper"] },
  { name: "React", mark: "Re", group: "Frontend", used: ["oi-tesla-pool", "bswa", "nestmate"] },
  { name: "Next.js", mark: "Nx", group: "Frontend", used: ["nestmate"] },
  { name: "React Native", mark: "RN", group: "Frontend", used: ["krishikonnect"] },
  { name: "Tailwind CSS", mark: "Tw", group: "Frontend", used: ["oi-tesla-pool", "nestmate"] },
  { name: "Node.js", mark: "No", group: "Backend", used: ["oi-tesla-pool", "nestmate"] },
  { name: "Express.js", mark: "Ex", group: "Backend", used: ["oi-tesla-pool", "nestmate"] },
  { name: "FastAPI", mark: "Fa", group: "Backend", used: ["gravity-cloud", "news-scraper"] },
  { name: "REST APIs", mark: "{}", group: "Backend", used: ["oi-tesla-pool", "bswa", "nestmate", "gravity-cloud", "news-scraper"] },
  { name: "JWT Auth", mark: "JW", group: "Backend", note: "Stateless auth for protected routes." },
  { name: "PostgreSQL", mark: "Pg", group: "Data", used: ["oi-tesla-pool", "bswa", "news-scraper"] },
  { name: "MongoDB", mark: "Mo", group: "Data", used: ["nestmate"] },
  { name: "Redis", mark: "Rd", group: "Data", used: ["gravity-cloud"] },
  { name: "Supabase", mark: "Sb", group: "Data", used: ["oi-tesla-pool", "bswa", "news-scraper"] },
  { name: "Firebase", mark: "Fb", group: "Data", used: ["nestmate", "krishikonnect"] },
  { name: "Docker", mark: "Dk", group: "DevOps", used: ["gravity-cloud"] },
  { name: "Nginx", mark: "Ng", group: "DevOps", used: ["gravity-cloud"] },
  { name: "GitHub Actions", mark: "GA", group: "DevOps", used: ["news-scraper"] },
  { name: "Prometheus", mark: "Pr", group: "DevOps", used: ["gravity-cloud"] },
  {
    name: "Prompt Engineering",
    mark: "✦",
    group: "AI",
    note: "Claude, ChatGPT and Gemini — structured prompts and context for coding, debugging, research and writing.",
  },
];

export const alsoInToolkit = [
  "MySQL",
  "Gin (Go)",
  "Microservices",
  "Docker Compose",
  "Grafana",
  "Git",
  "CI/CD",
  "Linux / Bash",
  "Postman",
  "Vercel",
  "Render",
  "Jest",
  "PyTest",
  "HTML5",
  "CSS3",
];

export interface Milestone {
  when: string;
  year: string;
  tag: string;
  title: string;
  org: string;
  body: string;
  techs: string[];
}

// Newest first. Dates from the résumé and GitHub history.
export const journey: Milestone[] = [
  {
    when: "October 2026",
    year: "2026",
    tag: "Latest ship",
    title: "BSWA",
    org: "Community platform · Live on Cloudflare Pages + Render",
    body: "A bilingual platform for Brahmanbaria students and alumni at Jagannath University: public directory and heritage site, reviewed membership and a full admin panel, on a Go API and Supabase Postgres with row level security.",
    techs: ["Go", "React", "PostgreSQL", "Supabase", "Playwright"],
  },
  {
    when: "September – October 2026",
    year: "2026",
    tag: "Automation & data",
    title: "News Autopilot",
    org: "Personal project · Live on Vercel",
    body: "A news pipeline that runs itself: GitHub Actions scrapes Bangladeshi newspapers every five minutes into Supabase, publishes photo-cards to Facebook, and serves a reader-facing PWA from one FastAPI app.",
    techs: ["Python", "FastAPI", "Supabase", "GitHub Actions", "Pillow"],
  },
  {
    when: "September 2026",
    year: "2026",
    tag: "Full-stack & backend",
    title: "Oi Tesla Pool",
    org: "Personal project · Live on Vercel + Render",
    body: "Direction-aware ride pooling for Dhaka's battery rickshaws. Race-safe seat booking with atomic SQL and row locks, every lifecycle as a finite-state machine, deployed end to end.",
    techs: ["React", "TypeScript", "Express", "PostgreSQL", "Supabase"],
  },
  {
    when: "May – August 2026",
    year: "2026",
    tag: "Backend & DevOps",
    title: "GravityCloud",
    org: "Personal project · Docker Compose",
    body: "Split a local AI chat app into containerised services behind an Nginx load balancer, with a scheduler that scales the FastAPI gateway from one to three replicas on queue depth.",
    techs: ["Python", "FastAPI", "Docker", "Redis", "Prometheus"],
  },
  {
    when: "April – May 2026",
    year: "2026",
    tag: "Full-stack",
    title: "NestMate",
    org: "Personal project · Live on Vercel",
    body: "A roommate finder and household hub: listings with nearby search, join-code households, a shared meal ledger with fair-share dues, and messaging.",
    techs: ["Next.js", "TypeScript", "Express", "MongoDB", "Firebase"],
  },
  {
    when: "2025",
    year: "2025",
    tag: "Mobile",
    title: "KrishiKonnect",
    org: "Personal project · Android",
    body: "An Expo / React Native marketplace connecting farmers and shops with buyers, with live Firestore listeners, maps and directions.",
    techs: ["React Native", "Expo", "Firebase", "Firestore"],
  },
];

export const education = [
  {
    when: "2021 — Present",
    title: "B.Sc. in Computer Science & Engineering",
    school: "Jagannath University",
    place: "Dhaka, Bangladesh",
    detail: "CGPA 3.25 / 4.00 · Algorithms, Database Systems, Software Engineering, System Design",
  },
  {
    when: "2019 — 2020",
    title: "Higher Secondary Certificate (Science)",
    school: "Birshrestho Munsi Abdur Rouf Public College",
    place: "Dhaka, Bangladesh",
    detail: "GPA 5.00 / 5.00",
  },
];
