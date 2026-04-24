import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import { existsSync } from "node:fs";
import path from "node:path";

const envCandidates = [
  path.resolve(process.cwd(), "server/.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(path.dirname(new URL(import.meta.url).pathname), ".env"),
];

const envPath = envCandidates.find((candidate) => existsSync(candidate));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/", (_req, res) => {
  res
    .status(200)
    .send("Portfolio backend is running. Use /api/health or /api/contact.");
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!toEmail || !fromEmail || !smtpUser || !smtpPass) {
    return res.status(500).json({ error: "Server email is not configured." });
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>`,
    });

    return res.status(200).json({ message: "Message sent." });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Email send failed:", errorMsg);
    return res.status(500).json({ error: `Email send failed: ${errorMsg}` });
  }
});

app.listen(port, () => {
  console.log(`Contact API running at http://localhost:${port}`);
});
