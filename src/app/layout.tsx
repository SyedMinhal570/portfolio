import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

/** Space Grotesk — used for headings (font-heading utility) */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/** Inter — used for body text (default font on body) */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Minhal | Portfolio",
  description:
    "Computer Engineering student specializing in AI/ML, embedded systems, and full-stack development.",
  keywords: [
    "Muhammad Minhal",
    "portfolio",
    "computer engineering",
    "AI/ML",
    "embedded systems",
    "MERN stack",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen bg-background font-body antialiased text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
