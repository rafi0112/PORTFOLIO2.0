interface NavigationProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  gotoSection: (id: string) => void;
  activeNav: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navigation({
  theme,
  toggleTheme,
  gotoSection,
  activeNav,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavigationProps) {
  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Skills", id: "skills" },
    { label: "Work", id: "projects" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav id="navbar">
        <div className="nav-logo">
          <div className="nav-logo-dot"></div>
          &lt;rafi /&gt;
        </div>

        <div className="nav-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeNav === item.id ? "active" : ""}`}
              onClick={() => gotoSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <button className="nav-hire" onClick={() => gotoSection("contact")}>
            Hire Me →
          </button>
          <button
            className="hamburger"
            id="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        id="mobileMenu"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${activeNav === item.id ? "active" : ""}`}
            onClick={() => {
              gotoSection(item.id);
              setMobileMenuOpen(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
