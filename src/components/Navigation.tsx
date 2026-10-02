import ThemePicker from "./ThemePicker";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

interface NavigationProps {
  themeId: string;
  pickTheme: (id: string, origin: { x: number; y: number }) => void;
  openPalette: () => void;
  gotoSection: (id: string) => void;
  activeNav: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navigation({
  themeId,
  pickTheme,
  openPalette,
  gotoSection,
  activeNav,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavigationProps) {
  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Skills", id: "skills" },
    { label: "Lab", id: "playground" },
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
            className="cmdk-trigger"
            onClick={openPalette}
            aria-label="Open command palette"
          >
            Search <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <ThemePicker themeId={themeId} onPick={pickTheme} />
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
        <button
          className="nav-link"
          onClick={() => {
            setMobileMenuOpen(false);
            openPalette();
          }}
        >
          Search…
        </button>
      </div>
    </>
  );
}
