import React from "react";
import RevealOnScroll from "../RevealOnScroll";

interface Skill {
  icon: string;
  name: string;
  cat: string;
  v: string;
}

const skills1: Skill[] = [
  { icon: "⚡", name: "Go", cat: "language", v: "v1" },
  { icon: "🐍", name: "Python", cat: "language", v: "v2" },
  { icon: "⚙️", name: "C++", cat: "language", v: "v3" },
  { icon: "🟨", name: "JavaScript ES6+", cat: "language", v: "v6" },
  { icon: "🌐", name: "React", cat: "web", v: "v2" },
  { icon: "🟢", name: "Node.js", cat: "web", v: "v4" },
  { icon: "🚂", name: "Express.js", cat: "web", v: "v1" },
  { icon: "🍃", name: "MongoDB", cat: "database", v: "v4" },
  { icon: "📱", name: "React Native", cat: "mobile", v: "v5" },
  { icon: "🔑", name: "JWT Auth", cat: "backend", v: "v3" },
];

const skills2: Skill[] = [
  { icon: "🐳", name: "Docker", cat: "devops", v: "v2" },
  { icon: "🔄", name: "CI/CD Pipelines", cat: "devops", v: "v3" },
  { icon: "🐧", name: "Linux / Bash", cat: "devops", v: "v1" },
  { icon: "🐙", name: "Git & GitHub", cat: "devops", v: "v5" },
  { icon: "⚡", name: "GitHub Actions", cat: "devops", v: "v6" },
  { icon: "🧠", name: "DSA", cat: "fundamentals", v: "v4" },
  { icon: "🏗️", name: "Microservices", cat: "architecture", v: "v1" },
  { icon: "🗄️", name: "SQL & NoSQL", cat: "database", v: "v2" },
  { icon: "🌐", name: "RESTful APIs", cat: "backend", v: "v3" },
  { icon: "🔬", name: "Unit Testing", cat: "tools", v: "v5" },
];

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
  <div className={`sk-card ${skill.v}`}>
    <div className="sk-icon">{skill.icon}</div>
    <div>
      <div className="sk-name">{skill.name}</div>
      <div className="sk-cat">{skill.cat}</div>
    </div>
  </div>
);

export default function Skills() {
  const createMarqueeContent = (skills: Skill[]) => {
    const doubled = [...skills, ...skills];
    return doubled.map((skill, idx) => <SkillCard key={idx} skill={skill} />);
  };

  return (
    <section id="skills">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">// expertise</div>
          <h2 className="sh-title">Technical Skills</h2>
          <p className="sh-sub">
            A multi-disciplinary toolkit spanning languages, frameworks,
            systems, and DevOps.
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.08}>
        <div className="skills-marquee-wrap">
          <div className="skills-row" id="row1">
            {createMarqueeContent(skills1)}
          </div>
          <div className="skills-row rev" id="row2">
            {createMarqueeContent(skills2)}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
