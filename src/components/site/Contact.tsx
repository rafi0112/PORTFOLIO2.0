import { useState } from "react";
import { Reveal, SectionHead } from "./ui";
import { profile } from "../../data/profile";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { kind: "idle" | "sending" | "ok" | "error"; text?: string };

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ kind: "error", text: "Please add your name, email and a message." });
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setStatus({ kind: "error", text: "That email address doesn't look right." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      // The API takes name, email and message; an optional phone rides along in the message.
      const message = form.phone.trim() ? `${form.message}\n\nPhone: ${form.phone.trim()}` : form.message;
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Couldn't send your message.");
      }
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus({ kind: "ok", text: "Message sent — I'll reply within 24 hours." });
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Couldn't send your message." });
    }
  };

  return (
    <section id="contact" className="sec">
      <SectionHead
        index="06"
        label="Your next big idea"
        aside="Starts with a hello"
        title="Let's build"
        accent="something together."
        side={
          <span className="spark" aria-hidden>
            ✳
          </span>
        }
      />

      <div className="contact">
        <Reveal className="contact-info">
          <p className="contact-lead">
            Have a role, a project, or a team that cares about software built with care? Let&apos;s talk — I reply within
            24 hours.
          </p>
          <a className="contact-mail" href={`mailto:${profile.email}?subject=Portfolio%20inquiry`}>
            {profile.email} <span aria-hidden>↗</span>
          </a>
          <a className="contact-phone" href={profile.phoneHref}>
            {profile.phone}
          </a>
          <p className="muted small">{profile.city}</p>

          <div className="btn-row">
            <a className="btn-ghost" href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp ↗
            </a>
            <a className="btn-ghost" href={profile.resume} download={profile.resumeName}>
              Résumé ↓
            </a>
          </div>
          <div className="text-links">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} as="div" className="contact-form-wrap">
          <form className="contact-form" onSubmit={submit} noValidate>
            <label>
              <span>Your name</span>
              <input value={form.name} onChange={set("name")} placeholder="How should I call you?" autoComplete="name" />
            </label>
            <label>
              <span>Email address</span>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" />
            </label>
            <label className="full">
              <span>
                Phone <em>(optional)</em>
              </span>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Your contact number" autoComplete="tel" />
            </label>
            <label className="full">
              <span>What do you have in mind?</span>
              <textarea value={form.message} onChange={set("message")} rows={4} placeholder="A role, a project, a better way of doing things…" />
            </label>
            <div className="full form-foot">
              <button className="btn-dark" type="submit" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : "Send message"} <span aria-hidden>↗</span>
              </button>
              <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
                {status.text}
              </p>
            </div>
          </form>
        </Reveal>
      </div>

      <footer className="foot">
        <span className="logo small" aria-hidden>
          RK<i />
        </span>
        <span>© 2026 {profile.name}</span>
        <span className="foot-tag">Thoughtful systems. Human interfaces.</span>
      </footer>
    </section>
  );
}
