import React, { useState } from "react";
import RevealOnScroll from "../RevealOnScroll";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForm = async () => {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setFormMessage("// Please fill in all fields.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setFormMessage("// Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setFormMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || "Failed to send message.");
      }

      setFormMessage("// Message sent! I'll reply within 24 hours.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";
      setFormMessage(`// ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
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
              <a
                className="c-link"
                href="mailto:rafi011235@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Rafiul%2C"
              >
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
                href="https://www.linkedin.com/in/khandaker-rafiul-islam-6b80882b2/"
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
                name="name"
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
                name="email"
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
                name="message"
                placeholder="Tell me about your project or opportunity..."
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button
              className="fsub"
              onClick={handleForm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message ↗"}
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
