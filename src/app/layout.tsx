import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAI Chat",
  description: "MAI Chat — Generative UI powered by Bebop design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
