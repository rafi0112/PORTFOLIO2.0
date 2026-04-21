import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import StarsBackground from "./components/StarsBackground";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("hero");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const gotoSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "skills", "projects", "about", "contact"];
      let current = "hero";

      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element && window.scrollY >= element.offsetTop - 120) {
          current = id;
        }
      });

      setActiveNav(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <StarsBackground isDark={theme === "dark"} />
      <ScrollProgress />
      <Navigation
        theme={theme}
        toggleTheme={toggleTheme}
        gotoSection={gotoSection}
        activeNav={activeNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="page">
        <Hero />
        <Skills />
        <Projects />
        <About />
        <Contact />
      </div>

      <Footer gotoSection={gotoSection} />
    </>
  );
}
