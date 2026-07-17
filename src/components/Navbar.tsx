"use client";

/**
 * Navbar — sticky glass nav with scroll-spy active link highlighting.
 */

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const ids = navLinks.map((link) => link.href.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function linkClass(href: string, mobile = false) {
    const isActive = activeHref === href;
    if (mobile) {
      return `block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
        isActive
          ? "bg-white/5 text-accent-cyan"
          : "text-zinc-300 hover:text-accent-cyan"
      }`;
    }
    return `relative text-sm font-medium transition-colors ${
      isActive
        ? "text-accent-cyan"
        : "text-zinc-400 hover:text-accent-cyan"
    } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-gradient-accent after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          className="font-heading text-lg font-bold tracking-tight text-white transition-colors hover:text-accent-purple sm:text-xl"
          onClick={closeMenu}
        >
          {personalInfo.name.split(" ").pop()}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={linkClass(link.href)}
                aria-current={activeHref === link.href ? "true" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

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

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={linkClass(link.href, true)}
                  aria-current={activeHref === link.href ? "true" : undefined}
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
