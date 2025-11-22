import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "n8n AI Workflow Architect",
  description:
    "Design Telegram-ready n8n automations with structured outputs, documentation, and operator runbooks."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
