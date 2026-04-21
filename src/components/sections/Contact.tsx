import React, { useRef, useState } from "react";
import RevealOnScroll from "../RevealOnScroll";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("c", "")]: value,
    }));
  };

  const handleForm = async () => {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setFormMessage("// Please fill in all fields.");
      return;
    }

    if (submitBtnRef.current) {
      setIsSubmitting(true);
      submitBtnRef.current.textContent = "Sending...";
      submitBtnRef.current.disabled = true;
    }

    // Simulate sending
    setTimeout(() => {
      setFormMessage("// Message sent! I'll reply within 24 hours.");
      if (submitBtnRef.current) {
        submitBtnRef.current.textContent = "Sent ✓";
      }
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);

      // Reset after 3 seconds
      setTimeout(() => {
        if (submitBtnRef.current) {
          submitBtnRef.current.textContent = "Send Message ↗";
          submitBtnRef.current.disabled = false;
        }
        setFormMessage("");
      }, 3000);
    }, 1100);
  };

  return (
    <section id="contact">
      <RevealOnScroll>
        <div className="sh">
          <div className="sh-label">// lets_talk</div>
          <h2 className="sh-title">Get In Touch</h2>
          <p className="sh-sub">
            Open to full-time roles, internships, and interesting project
            conversations.
          </p>
        </div>
      </RevealOnScroll>

      <div className="contact-grid">
        <RevealOnScroll delay={0.08}>
          <div>
            <p className="contact-intro">
              Whether you have an opportunity or just want to connect — my inbox
              is always open. I'll reply within 24 hours.
            </p>
            <div className="c-links">
              <a className="c-link" href="mailto:rafi011235@gmail.com">
                <div className="c-link-icon">✉</div>
                <div>
                  <div className="c-link-label">Email</div>
                  <div className="c-link-val">rafi011235@gmail.com</div>
                </div>
                <div className="c-link-arrow">→</div>
              </a>
              <a className="c-link" href="tel:+8801311183481">
                <div className="c-link-icon">📞</div>
                <div>
                  <div className="c-link-label">Phone</div>
                  <div className="c-link-val">+880 1311 183481</div>
                </div>
                <div className="c-link-arrow">→</div>
              </a>
              <a
                className="c-link"
                href="https://linkedin.com/in/khandaker-rafiul-islam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="c-link-icon">💼</div>
                <div>
                  <div className="c-link-label">LinkedIn</div>
                  <div className="c-link-val">khandaker-rafiul-islam</div>
                </div>
                <div className="c-link-arrow">→</div>
              </a>
              <a
                className="c-link"
                href="https://github.com/rafi0112"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="c-link-icon">⌥</div>
                <div>
                  <div className="c-link-label">GitHub</div>
                  <div className="c-link-val">github.com/rafi0112</div>
                </div>
                <div className="c-link-arrow">→</div>
              </a>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.16}>
          <div className="cform">
            <div className="cform-label-row">// send_message</div>
            <div className="fg">
              <label className="fl">Name</label>
              <input
                className="fi"
                type="text"
                id="cName"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label className="fl">Email</label>
              <input
                className="fi"
                type="email"
                id="cEmail"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label className="fl">Message</label>
              <textarea
                className="fta"
                id="cMessage"
                placeholder="Tell me about your project or opportunity..."
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button
              className="fsub"
              ref={submitBtnRef}
              onClick={handleForm}
              disabled={isSubmitting}
            >
              Send Message ↗
            </button>
            <div className="fmsg" style={{ color: "var(--acc)" }}>
              {formMessage}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
