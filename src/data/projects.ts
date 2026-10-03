import type { ArchSpec } from "../components/ArchDiagram";

export interface TradeOff {
  kind: "Trade-off" | "Principle";
  title: string;
  body: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image?: string;
  featured?: boolean;
  status: "live" | "done";
  points: string[];
  techs: string[];
  links: { label: string; url: string }[];
  arch: ArchSpec;
  tradeoffs: TradeOff[];
}

/*
  Architecture drawings use one layout grid so every case file reads the same:
  a main flow down the left column, collaborators in the middle column, and
  design notes on the right. All facts come from each project's README / code.
*/
const C1 = 16;
const C2 = 272;
const C3 = 528;
const W = 208; // box width in the two flow columns
const NW = 216; // note width
const BAND = { x: 0, w: 496 }; // a group band around both flow columns

export const projects: Project[] = [
  {
    id: "oi-tesla-pool",
    title: "Oi Tesla Pool",
    subtitle: "// direction-aware ride pooling for Dhaka",
    icon: "🛺",
    image: "/oi-tesla-pool.webp",
    featured: true,
    status: "live",
    points: [
      "Ride-pooling platform for battery rickshaws: riders heading within 90° of each other share one vehicle automatically, and pay 20% less.",
      "Race-safe booking: seats are claimed with one atomic conditional UPDATE, and check-then-write flows use Postgres row locks (SELECT … FOR UPDATE).",
      "Every ride and pool status change runs through a single finite-state machine, so illegal transitions are impossible by construction.",
      "Live pool window with a shared countdown; each passenger can halve it exactly once, enforced in the database, not just the UI.",
      "Driver earnings (today and all-time) computed in one query with FILTER aggregates, backed by a partial index to stay fast as data grows.",
      "Supabase Auth with email/password plus Google and LinkedIn OAuth; a database trigger provisions profiles and vehicles on sign-up.",
      "Integer-paisa money model, DTO-only API responses, and zod validation on every request body.",
      "Deployed as a React/Vite frontend on Vercel and an Express API on Render, backed by Supabase Postgres.",
    ],
    techs: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Supabase", "Tailwind CSS"],
    links: [
      { label: "⌥ GitHub", url: "https://github.com/rafi0112/oi-tesla-pool" },
      { label: "↗ Live Demo", url: "https://oi-tesla-pool.vercel.app" },
    ],
    arch: {
      w: 760,
      h: 552,
      groups: [{ ...BAND, y: 340, h: 212, label: "Postgres does the hard parts" }],
      nodes: [
        { id: "riders", title: "riders & drivers", sub: "battery rickshaws", x: C1, y: 0, w: W, h: 56, kind: "client" },
        { id: "n-pool", title: "pooling rule", sub: "Headings within 90° share one vehicle; riders pay 20% less.", x: C3, y: 0, w: NW, h: 72, kind: "note" },
        { id: "web", title: "React + Vite", sub: "frontend · Vercel · polls every 4s", x: C1, y: 104, w: W, h: 64 },
        { id: "auth", title: "Supabase Auth", sub: "email · Google · LinkedIn", x: C2, y: 104, w: W, h: 64, kind: "ext" },
        { id: "api", title: "Express API", sub: "Render · zod on every body · DTO-only responses", x: C1, y: 216, w: W, h: 76, kind: "primary" },
        { id: "fsm", title: "ride state machine", sub: "every ride & pool status goes through one FSM", x: C2, y: 216, w: W, h: 76 },
        { id: "n-fsm", title: "no illegal states", sub: "Invalid transitions are impossible by construction.", x: C3, y: 216, w: NW, h: 76, kind: "note" },
        { id: "db", title: "Supabase Postgres", sub: "source of truth · raw SQL via pg", x: C1, y: 372, w: W, h: 72, kind: "store" },
        { id: "trigger", title: "sign-up trigger", sub: "provisions profile + vehicle", x: C2, y: 376, w: W, h: 64, kind: "soft" },
        { id: "n-race", title: "race-safe booking", sub: "Atomic conditional UPDATE + SELECT … FOR UPDATE.", x: C3, y: 372, w: NW, h: 72, kind: "note" },
        { id: "window", title: "pool window", sub: "shared countdown, halve once — enforced in DB", x: C1, y: 472, w: W, h: 64, kind: "soft" },
        { id: "earn", title: "driver earnings", sub: "one query · FILTER + partial index", x: C2, y: 472, w: W, h: 64, kind: "soft" },
        { id: "n-money", title: "money model", sub: "Integer paisa everywhere — no float drift.", x: C3, y: 472, w: NW, h: 64, kind: "note" },
      ],
      edges: [
        { from: "riders", to: "web" },
        { from: "web", to: "auth" },
        { from: "web", to: "api" },
        { from: "api", to: "fsm" },
        { from: "api", to: "db" },
        { from: "db", to: "trigger", dashed: true },
        { from: "fsm", to: "n-fsm", note: true },
        { from: "trigger", to: "n-race", note: true },
        { from: "earn", to: "n-money", note: true },
      ],
    },
    tradeoffs: [
      {
        kind: "Trade-off",
        title: "Consistency over speed for seat claims",
        body: "Counting seats from rides needs a read-then-write — a race under concurrent bookings. A stored seat column allows one atomic conditional UPDATE.",
      },
      {
        kind: "Principle",
        title: "Rules live in the database, not the UI",
        body: "The pool window, seat limits and sign-up provisioning are enforced in Postgres, so no client can bypass them.",
      },
      {
        kind: "Principle",
        title: "One state machine owns every change",
        body: "Pool and ride transitions run through one FSM and are logged to separate audit tables — invalid states can't be written.",
      },
    ],
  },
  {
    id: "nestmate",
    title: "NestMate",
    subtitle: "// roommate finder & household hub",
    icon: "🏠",
    status: "live",
    points: [
      "Roommate finder: browse listings by city, price, room type and lifestyle, with nearby search on a map.",
      "Household Hub: join with a 6-character code, then track the grocery ledger, daily meals, dues and payments.",
      "Fair-share calculator turns 30 days of meal units into each member's share of the costs.",
      "Direct messages with optimistic UI, group room chat, mess-mate reviews and an in-app notification feed.",
      "Express + MongoDB API with 15 endpoint groups, JSON Schema validation and compound, unique, geospatial, text and TTL indexes.",
      "Next.js 16 frontend that proxies API calls through its own routes; Firebase Auth with email and Google sign-in.",
    ],
    techs: ["Next.js", "React 19", "TypeScript", "Express.js", "MongoDB", "Firebase", "Tailwind CSS"],
    links: [
      { label: "⌥ Client", url: "https://github.com/rafi0112/nestmate-frontend" },
      { label: "⌥ Server", url: "https://github.com/rafi0112/nestmate-backend" },
      { label: "↗ Live Demo", url: "https://nestmate00.vercel.app" },
    ],
    arch: {
      w: 760,
      h: 552,
      groups: [{ ...BAND, y: 340, h: 212, label: "MongoDB does the hard parts" }],
      nodes: [
        { id: "web", title: "Next.js 16 app", sub: "React 19 · Vercel", x: C1, y: 0, w: W, h: 64, kind: "client" },
        { id: "auth", title: "Firebase Auth", sub: "email · Google sign-in", x: C2, y: 0, w: W, h: 64, kind: "ext" },
        { id: "routes", title: "Next.js API routes", sub: "proxy /api/* → backend", x: C1, y: 104, w: W, h: 64 },
        { id: "n-poll", title: "polling, not sockets", sub: "DMs every 8s, room chat every 5s — simple on serverless.", x: C2, y: 104, w: W, h: 64, kind: "note" },
        { id: "api", title: "Express API", sub: "Vercel serverless · 15 endpoint groups", x: C1, y: 216, w: W, h: 76, kind: "primary" },
        { id: "house", title: "household logic", sub: "join codes · fair-share pipelines", x: C2, y: 216, w: W, h: 76 },
        { id: "db", title: "MongoDB Atlas", sub: "10 collections · JSON Schema", x: C1, y: 372, w: W, h: 72, kind: "store" },
        { id: "uniq", title: "unique indexes", sub: "(household, user, date) · joinCode", x: C2, y: 376, w: W, h: 64, kind: "soft" },
        { id: "n-uniq", title: "idempotent upserts", sub: "Logging the same day's meals twice updates one row.", x: C3, y: 372, w: NW, h: 72, kind: "note" },
        { id: "geo", title: "geo + text search", sub: "2dsphere · full-text on listings", x: C1, y: 472, w: W, h: 64, kind: "soft" },
        { id: "ttl", title: "TTL indexes", sub: "chat 90 days · notifications 30", x: C2, y: 472, w: W, h: 64, kind: "soft" },
        { id: "n-ttl", title: "data that expires itself", sub: "Old chat and notifications vanish — no cron job.", x: C3, y: 472, w: NW, h: 64, kind: "note" },
      ],
      edges: [
        { from: "web", to: "auth" },
        { from: "web", to: "routes" },
        { from: "routes", to: "api" },
        { from: "routes", to: "n-poll", note: true },
        { from: "api", to: "house" },
        { from: "api", to: "db" },
        { from: "db", to: "uniq", dashed: true },
        { from: "uniq", to: "n-uniq", note: true },
        { from: "ttl", to: "n-ttl", note: true },
      ],
    },
    tradeoffs: [
      {
        kind: "Trade-off",
        title: "Polling over WebSockets",
        body: "Messages refresh every 8s and room chat every 5s. Easy to run on serverless hosting, at the cost of a few seconds' delay and extra requests.",
      },
      {
        kind: "Principle",
        title: "Let indexes enforce the rules",
        body: "A unique (household, user, date) index turns meal logging into an idempotent upsert, and unique join codes can't collide.",
      },
      {
        kind: "Principle",
        title: "Data that expires itself",
        body: "TTL indexes purge room chat after 90 days and notifications after 30 — nothing to schedule or forget.",
      },
    ],
  },
  {
    id: "gravity-cloud",
    title: "GravityCloud",
    subtitle: "// self-scaling, distributed AI infrastructure",
    icon: "☁️",
    status: "done",
    points: [
      "Splits a local AI chat app into containerised services: gateway, model, embeddings, vector store, job queue and scheduler.",
      "An Nginx load balancer keeps one stable API port while 1–3 FastAPI gateway replicas scale behind it.",
      "A scheduler polls queue depth every 5 seconds and scales the gateway up or down through Docker.",
      "Requests go to the least-busy healthy inference node; nodes are health-checked every 15 seconds.",
      "Retrieval with Ollama embeddings and ChromaDB, plus a Redis-backed job queue.",
      "Prometheus scrapes every service; Grafana dashboards show queue depth, active requests and replica count.",
    ],
    techs: ["Python", "FastAPI", "Docker", "Nginx", "Redis", "Ollama", "ChromaDB", "Prometheus", "Grafana"],
    links: [{ label: "⌥ GitHub", url: "https://github.com/rafi0112/Gravity-Cloud/tree/main/GravityCloud" }],
    arch: {
      w: 760,
      h: 552,
      groups: [{ ...BAND, y: 340, h: 212, label: "Model & retrieval plane" }],
      nodes: [
        { id: "fe", title: "React dashboard", sub: "Vite · served by Nginx", x: C1, y: 0, w: W, h: 64, kind: "client" },
        { id: "prom", title: "Prometheus + Grafana", sub: "scrape /metrics every 5s", x: C2, y: 0, w: W, h: 64, kind: "ext" },
        { id: "lb", title: "gateway-lb", sub: "Nginx · one stable port :8000", x: C1, y: 104, w: W, h: 64 },
        { id: "sched", title: "scheduler", sub: "autoscaler · polls every 5s", x: C2, y: 104, w: W, h: 64 },
        { id: "n-sched", title: "scale on queue depth", sub: "<2 pending → 1 replica · ≥2 → 2 · ≥5 → 3", x: C3, y: 104, w: NW, h: 64, kind: "note" },
        { id: "gw", title: "gateway-service", sub: "FastAPI · 1–3 replicas", x: C1, y: 216, w: W, h: 76, kind: "primary" },
        { id: "queue", title: "queue-service", sub: "Redis · job states", x: C2, y: 220, w: W, h: 68, kind: "store" },
        { id: "n-queue", title: "single writer", sub: "The queue never scales, so job state never splits.", x: C3, y: 216, w: NW, h: 76, kind: "note" },
        { id: "osvc", title: "ollama-service", sub: "least-busy healthy node", x: C1, y: 372, w: W, h: 72 },
        { id: "emb", title: "embedding-service", sub: "nomic-embed-text", x: C2, y: 376, w: W, h: 64 },
        { id: "n-health", title: "health-checked nodes", sub: "Every 15s — unhealthy nodes stop getting traffic.", x: C3, y: 372, w: NW, h: 72, kind: "note" },
        { id: "ollama", title: "Ollama runtime", sub: "gemma2:2b", x: C1, y: 472, w: W, h: 64, kind: "store" },
        { id: "vec", title: "vector-service", sub: "ChromaDB", x: C2, y: 472, w: W, h: 64, kind: "store" },
      ],
      edges: [
        { from: "fe", to: "lb" },
        { from: "lb", to: "gw" },
        { from: "gw", to: "queue" },
        { from: "prom", to: "sched", dashed: true },
        { from: "sched", to: "queue", dashed: true },
        // The scheduler scales the gateway: routed under the load balancer and
        // into the gateway's top-right, so it doesn't share the LB's arrow.
        { from: "sched", to: "gw", dashed: true, points: [[300, 168], [300, 194], [180, 194], [180, 213]] },
        { from: "gw", to: "osvc" },
        { from: "gw", to: "emb" },
        { from: "osvc", to: "ollama" },
        { from: "vec", to: "emb" },
        { from: "sched", to: "n-sched", note: true },
        { from: "queue", to: "n-queue", note: true },
      ],
    },
    tradeoffs: [
      {
        kind: "Trade-off",
        title: "Scale only the stateless part",
        body: "Gateway replicas come and go; the queue stays a single writer, so job state is never split across nodes.",
      },
      {
        kind: "Principle",
        title: "One stable entry point",
        body: "An Nginx load balancer keeps port 8000 fixed while replicas scale behind it — clients never notice.",
      },
      {
        kind: "Trade-off",
        title: "Simple threshold autoscaling",
        body: "Fixed thresholds polled every 5 seconds are easy to reason about, but react to short bursts with a delay.",
      },
    ],
  },
  {
    id: "news-scraper",
    title: "News Autopilot",
    subtitle: "// scrape, store, publish and read — on a schedule",
    icon: "📰",
    status: "live",
    points: [
      "Scrapes Bangladeshi newspapers (bdnews24, Prothom Alo, The Business Standard, The Daily Star) on a 5-minute GitHub Actions schedule into Supabase Postgres — metadata and links only, with a unique URL stopping duplicates.",
      "Builds a photo-card with Pillow from each article's real image and publishes up to 3 per run to a Facebook Page through the Graph API; failures are saved on the row and retried, not lost.",
      "An hourly database job deletes news older than a day, so the whole site runs on a rolling 24-hour window.",
      "One FastAPI app serves the website and its API on Vercel: /api/today returns the last 24 hours, /api/palestine returns the live Palestine desk.",
      "The Palestine desk pulls 27 free RSS and YouTube feeds concurrently, keyword-filters and de-duplicates them, and caches the result for 10 minutes. It is served live and never stored, so it cannot reach the Facebook poster.",
      "A \"For You\" feed ranks stories in the browser from what the reader opens, watches, saves and hides, plus freshness and trending topics. Each card says why it is there, and nothing leaves the device.",
      "Instagram-style Stories, a YouTube-style Shorts feed with autoplay, a video player with Up next, Ctrl K search and a saved-and-history library.",
      "An installable PWA in plain HTML, CSS and JavaScript: light and dark themes, a bottom tab bar and stacked card deck on phones, and a crimson-drips moment on the Palestine tab every 30 seconds (skipped for reduced motion).",
    ],
    techs: ["Python", "FastAPI", "BeautifulSoup", "Supabase", "PostgreSQL", "Pillow", "GitHub Actions", "Graph API", "Vercel", "JavaScript"],
    links: [
      { label: "⌥ GitHub", url: "https://github.com/rafi0112/news-paper-scrap" },
      { label: "↗ Live Demo", url: "https://news-paper-scrap.vercel.app" },
    ],
    arch: {
      w: 760,
      h: 644,
      groups: [{ ...BAND, y: 404, h: 240, label: "Reading side · FastAPI on Vercel" }],
      nodes: [
        { id: "actions", title: "GitHub Actions", sub: "cron · every 5 minutes", x: C1, y: 0, w: W, h: 64, kind: "primary" },
        { id: "n-actions", title: "why not a VPS", sub: "Start → scrape → post → exit. Nothing has to stay running.", x: C3, y: 0, w: NW, h: 64, kind: "note" },
        { id: "scraper", title: "scraper.py", sub: "BeautifulSoup · metadata + links", x: C1, y: 96, w: W, h: 64 },
        { id: "sites", title: "4 newspapers", sub: "bdnews24 · Prothom Alo · TBS · Daily Star", x: C2, y: 96, w: W, h: 64, kind: "ext" },
        { id: "db", title: "Supabase Postgres", sub: "news · url UNIQUE", x: C1, y: 200, w: W, h: 72, kind: "store" },
        { id: "clean", title: "cleanup job", sub: "hourly · deletes news > 1 day", x: C2, y: 204, w: W, h: 64, kind: "soft" },
        { id: "n-once", title: "idempotent re-runs", sub: "A unique URL means each article is stored — and posted — once.", x: C3, y: 200, w: NW, h: 72, kind: "note" },
        { id: "poster", title: "facebook_poster.py", sub: "Pillow photo-card · ≤3 posts per run", x: C2, y: 316, w: W, h: 64 },
        { id: "fb", title: "Facebook Page", sub: "Graph API", x: C3, y: 316, w: NW, h: 64, kind: "ext" },
        { id: "api", title: "FastAPI on Vercel", sub: "serves the site · /api/today · /api/palestine", x: C1, y: 436, w: W, h: 76, kind: "primary" },
        { id: "feeds", title: "27 free feeds", sub: "RSS + YouTube · Palestine desk", x: C2, y: 440, w: W, h: 64, kind: "ext" },
        { id: "n-live", title: "live, never stored", sub: "Cached 10 min and served live, so it never reaches the Facebook poster.", x: C3, y: 432, w: NW, h: 88, kind: "note" },
        { id: "app", title: "reader app", sub: "plain-JS PWA · For You · Stories · Shorts", x: C1, y: 552, w: W, h: 76, kind: "client" },
        { id: "n-rank", title: "ranked on your device", sub: "For You learns from opens, watches and saves — nothing leaves the browser.", x: C3, y: 548, w: NW, h: 84, kind: "note" },
      ],
      edges: [
        { from: "actions", to: "scraper" },
        { from: "actions", to: "n-actions", note: true },
        { from: "scraper", to: "sites", dashed: true },
        { from: "scraper", to: "db" },
        { from: "db", to: "clean", dashed: true },
        { from: "db", to: "poster" },
        { from: "poster", to: "fb" },
        { from: "db", to: "api" },
        { from: "feeds", to: "api", dashed: true },
        { from: "api", to: "app" },
        { from: "feeds", to: "n-live", note: true },
        { from: "app", to: "n-rank", note: true },
      ],
    },
    tradeoffs: [
      {
        kind: "Trade-off",
        title: "A scheduled runner, not a server",
        body: "GitHub Actions runs the pipeline on a 5-minute schedule with no machine to keep alive. The cost is freshness: GitHub can delay scheduled runs, so news arrives within minutes on a good day, not seconds.",
      },
      {
        kind: "Principle",
        title: "Idempotent by design",
        body: "url is UNIQUE and only unposted rows are picked, so a re-run can never store or publish the same article twice.",
      },
      {
        kind: "Trade-off",
        title: "Live feeds instead of stored rows",
        body: "Palestine coverage is fetched on demand and cached for 10 minutes rather than saved to Supabase. It needs no cleanup and can never be auto-posted, but it depends on the sources being up.",
      },
      {
        kind: "Trade-off",
        title: "Personalised on the device, not on a server",
        body: "Ranking runs in the browser from a profile saved locally, so nothing personal is collected. In exchange, the profile does not follow a reader to another device.",
      },
    ],
  },
  {
    id: "krishikonnect",
    title: "KrishiKonnect",
    subtitle: "// agri-tech mobile application",
    icon: "🌾",
    status: "done",
    points: [
      "Cross-platform Expo / React Native app connecting farmers and shop owners with buyers.",
      "Marketplace of shops and products, with orders tracked from placement to delivery.",
      "Products, shops and orders stream in live through Firestore real-time listeners.",
      "Location-aware: nearby shops on a map, and directions to each delivery location.",
      "Weather forecast on the market screen, for farmers planning their sales.",
      "Firebase Auth with Google Sign-In; product photos uploaded to imgbb.",
    ],
    techs: ["React Native", "Expo", "TypeScript", "Firebase", "Firestore", "Google Maps"],
    links: [{ label: "⌥ GitHub", url: "https://github.com/rafi0112/agricultural-app" }],
    arch: {
      w: 760,
      h: 480,
      nodes: [
        { id: "app", title: "Expo app", sub: "React Native · Android", x: C1, y: 0, w: W, h: 64, kind: "client" },
        { id: "auth", title: "Firebase Auth", sub: "Google Sign-In", x: C2, y: 0, w: W, h: 64, kind: "ext" },
        { id: "screens", title: "screens", sub: "market · shop · orders · blogs", x: C1, y: 104, w: W, h: 64, kind: "soft" },
        { id: "fs", title: "Firestore", sub: "products · shops · orders", x: C2, y: 104, w: W, h: 64, kind: "store" },
        { id: "n-fs", title: "no custom server", sub: "The app reads Firestore directly; listeners push changes.", x: C3, y: 104, w: NW, h: 64, kind: "note" },
        { id: "img", title: "imgbb", sub: "product photos", x: C2, y: 208, w: W, h: 64, kind: "ext" },
        { id: "maps", title: "Maps + location", sub: "nearby shops · directions", x: C2, y: 312, w: W, h: 64, kind: "ext" },
        { id: "wx", title: "OpenWeatherMap", sub: "forecast on the market screen", x: C2, y: 416, w: W, h: 64, kind: "ext" },
      ],
      edges: [
        { from: "app", to: "auth" },
        { from: "app", to: "screens" },
        // The app talks to every service directly: one trunk, several branches.
        { from: "app", to: "fs", points: [[224, 52], [248, 52], [248, 136], [269, 136]] },
        { from: "app", to: "img", dashed: true, points: [[224, 52], [248, 52], [248, 240], [269, 240]] },
        { from: "app", to: "maps", dashed: true, points: [[224, 52], [248, 52], [248, 344], [269, 344]] },
        { from: "app", to: "wx", dashed: true, points: [[224, 52], [248, 52], [248, 448], [269, 448]] },
        { from: "fs", to: "n-fs", note: true },
      ],
    },
    tradeoffs: [
      {
        kind: "Trade-off",
        title: "Serverless backend",
        body: "Firebase removes an API to run and scale. In exchange, more of the business logic lives in the app itself.",
      },
      {
        kind: "Trade-off",
        title: "Live listeners over polling",
        body: "Orders and stock update the moment they change, while every open screen holds its own listener.",
      },
    ],
  },
];
