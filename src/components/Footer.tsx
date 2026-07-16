/**
 * Footer — site footer with copyright, social links, and quick nav.
 * Server component (no client interactivity needed).
 */

import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { isSocialLinkActive, navLinks, personalInfo } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Brand + copyright */}
        <div className="text-center md:text-left">
          <p className="font-heading text-lg font-bold text-white">
            {personalInfo.name}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            © {currentYear} All rights reserved.
          </p>
        </div>

        {/* Quick nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-accent-cyan"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href={personalInfo.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-purple"
          >
            <GitHubIcon size={20} />
          </a>
          {isSocialLinkActive(personalInfo.social.linkedin) && (
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-cyan"
            >
              <LinkedInIcon size={20} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
