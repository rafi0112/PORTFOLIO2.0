import React from "react";
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
}

const projects: Project[] = [
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

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="proj-card">
    <div className={`proj-banner ${project.bannerClass}`}>
      <div className="proj-banner-grid"></div>
      <div className="proj-banner-glyph">{project.icon}</div>
      <div className={`proj-status-badge ${project.badgeClass}`}>
        {project.badgeText}
      </div>
    </div>
    <div className="proj-body">
      <div className="proj-title">{project.title}</div>
      <div className="proj-subtitle">{project.subtitle}</div>
      <ul className="proj-points">
        {project.points.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
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

export default function Projects() {
  return (
    <section id="projects">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">// portfolio</div>
          <h2 className="sh-title">Featured Projects</h2>
          <p className="sh-sub">
            Real applications built with purpose — from peer collaboration to
            agri-tech commerce.
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
