"use client";

/**
 * Navbar — sticky top navigation with smooth-scroll section links.
 * On mobile, links collapse into a hamburger menu (toggle with useState).
 * Uses backdrop-blur for a glass effect over page content.
 */

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / name — links back to hero */}
        <a
          href="#home"
          className="font-heading text-lg font-bold tracking-tight text-white transition-colors hover:text-accent-purple sm:text-xl"
          onClick={closeMenu}
        >
          {personalInfo.name.split(" ").pop()}
        </a>

        {/* Desktop links — hidden on small screens */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-accent-cyan"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-base font-medium text-zinc-300 transition-colors hover:text-accent-cyan"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
