import RevealOnScroll from "../RevealOnScroll";

export default function About() {
  return (
    <section id="about">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">// about_me</div>
          <h2 className="sh-title">Background</h2>
        </div>
      </RevealOnScroll>

      <div className="about-grid">
        <RevealOnScroll delay={0.08}>
          <div className="about-text">
            <p>
              Hi — I'm <strong>Khandaker Rafiul Islam</strong>, a Computer
              Science student at Jagannath University, Dhaka. My focus is{" "}
              <strong>backend engineering</strong> and designing systems that
              scale under real-world load.
            </p>
            <p>
              I'm fluent in the <strong>MERN stack</strong>, Go, and Python, and
              I apply rigorous
              <strong> Data Structures & Algorithms</strong> thinking to every
              system I build. I enjoy the whole stack — from schema design to
              responsive UI.
            </p>
            <p>
              Outside of project work, I sharpen my problem-solving on
              <strong> LeetCode</strong> and <strong>Codeforces</strong>, with a
              focus on optimized algorithm design.
            </p>

            <div className="about-facts">
              <div className="fact">
                <div className="fact-label">Location</div>
                <div className="fact-val">Dhaka, Bangladesh</div>
              </div>
              <div className="fact">
                <div className="fact-label">Email</div>
                <div className="fact-val" style={{ fontSize: "12px" }}>
                  rafi011235@gmail.com
                </div>
              </div>
              <div className="fact">
                <div className="fact-label">Languages</div>
                <div className="fact-val">English · Bangla</div>
              </div>
              <div className="fact">
                <div className="fact-label">Status</div>
                <div className="fact-val" style={{ color: "var(--acc)" }}>
                  Open to Work ✓
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.16}>
          <div className="about-right">
            <div className="edu-block">
              <div className="edu-block-label">// education</div>
              <div className="edu-item">
                <div>
                  <div className="edu-degree">
                    B.Sc. in Computer Science & Engineering
                  </div>
                  <div className="edu-school">Jagannath University</div>
                  <div className="edu-gpa">CGPA 3.25 / 4.00</div>
                </div>
                <div className="edu-year">2021 – Present</div>
              </div>
              <div className="edu-item">
                <div>
                  <div className="edu-degree">
                    Higher Secondary Certificate — Science
                  </div>
                  <div className="edu-school">
                    Birshrestho Munsi Abdur Rouf Public College
                  </div>
                  <div className="edu-gpa">GPA 5.00 / 5.00</div>
                </div>
                <div className="edu-year">2019 – 2020</div>
              </div>
            </div>

            <div className="achiev-block">
              <div
                className="edu-block-label"
                style={{ marginBottom: "0", paddingBottom: "0" }}
              >
                // achievements
              </div>
              <div className="achiev-item">
                <div className="achiev-icon">💻</div>
                <div>
                  <div className="achiev-title">Competitive Programming</div>
                  <div className="achiev-desc">
                    Active solver on LeetCode and Codeforces — focused on
                    optimized algorithm design.
                  </div>
                </div>
              </div>
              <div className="achiev-item">
                <div className="achiev-icon">🤝</div>
                <div>
                  <div className="achiev-title">Team Collaboration</div>
                  <div className="achiev-desc">
                    Strong technical communication and an agile development
                    mindset.
                  </div>
                </div>
              </div>
              <div className="achiev-item">
                <div className="achiev-icon">🌍</div>
                <div>
                  <div className="achiev-title">Bilingual</div>
                  <div className="achiev-desc">
                    Fluent in English (professional) and Bangla (native).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
