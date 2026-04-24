interface FooterProps {
  gotoSection: (id: string) => void;
}

export default function Footer({ gotoSection }: FooterProps) {
  const footerLinks = [
    { label: "Home", id: "hero" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">&lt;rafi /&gt;</div>
        <div className="footer-links">
          {footerLinks.map((link) => (
            <button
              key={link.id}
              className="fl-link"
              onClick={() => gotoSection(link.id)}
            >
              {link.label}
            </button>
          ))}
          <a
            className="fl-link"
            href="https://github.com/rafi0112"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="fl-link"
            href="https://www.linkedin.com/in/khandaker-rafiul-islam-6b80882b2/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <div className="footer-copy">
          © 2026 Khandaker Rafiul Islam · Dhaka, Bangladesh
        </div>
      </div>
    </footer>
  );
}
