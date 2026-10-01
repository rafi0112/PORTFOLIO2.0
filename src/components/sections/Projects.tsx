import React, { useState } from "react";
import RevealOnScroll from "../RevealOnScroll";

interface Project {
  title: string;
  subtitle: string;
  icon: string;
  bannerClass: string;
  badgeClass: string;
  badgeText: string;
  points: string[];
  techs: string[];
  links: { label: string; url: string }[];
  image?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Oi Tesla Pool",
    subtitle: "// direction-aware ride pooling for Dhaka",
    icon: "🛺",
    image: "/oi-tesla-pool.webp",
    featured: true,
    bannerClass: "proj-banner-4",
    badgeClass: "badge-live",
    badgeText: "● LIVE",
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
  },
  {
    title: "NestMate",
    subtitle: "// roommate finder & household hub",
    icon: "🏠",
    bannerClass: "proj-banner-3",
    badgeClass: "badge-live",
    badgeText: "● LIVE",
    points: [
    "Roommate discovery platform for browsing verified listings, saving favorites, and contacting hosts directly.",
    "Direct messaging system with conversation tracking and listing inquiry forwarding for faster roommate communication.",
    "Household Hub for managing shared living with member tracking, join-code access, and room-based organization.",
    "Automated meal ledger and expense tracking with fair-share calculations for groceries, rent, and monthly dues.",
    "Real-time room chat for household members, keeping group communication inside one shared space.",
    "Production-ready authentication and data persistence using Firebase Auth and MongoDB-backed storage.",
    "Responsive frontend experience designed for mobile and desktop with clean profile, listing, and household workflows.",
    ],
    techs: ["Next.js", "TypeScript", "Express.js", "MongoDB", "Firebase"],
    links: [
    {
    label: "⌥ Client",
    url: "https://github.com/rafi0112/nestmate-frontend",
    },
    { label: "⌥ Server", url: "https://github.com/rafi0112/nestmate-backend" },
    { label: "↗ Live Demo", url: "https://nestmate00.vercel.app" },
    ],
  },
  {
    title: "StudyTogether",
    subtitle: "// peer collaboration platform",
    icon: "📚",
    bannerClass: "proj-banner-1",
    badgeClass: "badge-live",
    badgeText: "● LIVE",
    points: [
      "Collaborative study app for managing, sharing, and tracking academic assignments in a centralized environment.",
      "Secure authentication with JWT — private routes for assignment creation, submission, and performance logs.",
      "Public dashboard with dynamic Light/Dark theme switching and high-performance filtering.",
      'Segregated public content from authenticated features like "My Attempts" and submission management.',
    ],
    techs: ["MongoDB", "Express.js", "React", "Node.js", "JWT"],
    links: [
      { label: "⌥ GitHub", url: "https://github.com/rafi0112" },
      { label: "↗ Live Demo", url: "https://groupstudyonline.web.app/" },
    ],
  },
  {
    title: "KrishiKonnect",
    subtitle: "// agri-tech mobile application",
    icon: "🌾",
    bannerClass: "proj-banner-2",
    badgeClass: "badge-done",
    badgeText: "✓ COMPLETED",
    points: [
      "Cross-platform mobile app to facilitate direct trade between farmers and consumers.",
      "Responsive marketplace UI with an end-to-end order management system.",
      "Streamlined communication with integrated notification and listing services.",
    ],
    techs: ["React Native", "Node.js", "MongoDB", "REST API"],
    links: [
      {
        label: "⌥ GitHub",
        url: "https://github.com/rafi0112/agricultural-app",
      },
    ],
  },
];
interface ProjectCardProps {
  project: Project;
}

// On phones, long cards show the first few points behind a toggle.
const PREVIEW_POINTS = 3;

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  // Hiding a single point behind a toggle isn't worth the extra tap.
  const collapsible = project.points.length > PREVIEW_POINTS + 1;
  return (
    <div className={`proj-card ${project.featured ? "featured" : ""}`}>
      <div className={`proj-banner ${project.bannerClass}`}>
        <div className="proj-banner-grid"></div>
        {project.image ? (
          <img className="proj-banner-img" src={project.image} alt="" />
        ) : (
          <div className="proj-banner-glyph">{project.icon}</div>
        )}
        {project.featured && <div className="badge-featured">★ FEATURED</div>}
        <div className={`proj-status-badge ${project.badgeClass}`}>
          {project.badgeText}
        </div>
      </div>
      <div className="proj-body">
        <div className="proj-title">{project.title}</div>
        <div className="proj-subtitle">{project.subtitle}</div>
        <ul className={`proj-points ${collapsible && !expanded ? "collapsed" : ""}`}>
          {project.points.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
        {collapsible && (
          <button
            className="proj-more"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded
              ? "Show less ↑"
              : `Show all ${project.points.length} details ↓`}
          </button>
        )}
        <div className="proj-techs">
          {project.techs.map((tech, idx) => (
            <span key={idx} className="proj-tech">
              {tech}
            </span>
          ))}
        </div>
        <div className="proj-links">
          {project.links.map((link, idx) => (
            <a
              key={idx}
              className="proj-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  return (
    <section id="projects">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label"><span className="sh-num">02</span> Selected work</div>
          <h2 className="sh-title">
            Things I&apos;ve <em>built</em>
          </h2>
          <p className="sh-sub">
            Real applications built with purpose — from race-safe ride pooling
            to peer collaboration and agri-tech commerce.
          </p>
        </div>
      </RevealOnScroll>

      <div className="projects-grid">
        {projects.map((project, idx) => (
          <RevealOnScroll key={idx} delay={0.12 + idx * 0.08}>
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
