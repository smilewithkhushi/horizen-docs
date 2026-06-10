import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const HORIZEN_LINKS = [
  { label: "Protocol Whitepaper", href: "https://horizen.io/whitepaper" },
  { label: "MiCAR Whitepaper", href: "https://horizen.io/micar" },
  { label: "Governance", href: "https://horizen.io/governance" },
  { label: "ZEN Migration Hub", href: "https://horizen.io/zen-migration" },
];

const DOCS_LINKS = [
  { label: "Horizen Chain", to: "/horizen-chain/overview/what-is-horizen" },
  { label: "VELA", to: "/vela/introduction" },
  { label: "Tutorials", to: "/tutorials/horizen-chain/deploy-erc20" },
  { label: "Migration", to: "/migration/overview" },
];

const ECOSYSTEM_LINKS = [
  { label: "Apps & Partners", href: "https://horizen.io/ecosystem" },
  { label: "Builder Funding Program", href: "https://horizen.thrive.xyz/" },
];

const SOCIAL_LINKS = [
  {
    label: "Telegram",
    href: "https://t.me/horizencommunity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.5l-2.95-.924c-.64-.203-.654-.64.135-.954l11.57-4.461c.537-.194 1.006.131.97.96z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/horizenglobal",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.gg/horizen-334085157441110017",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/HorizenOfficial",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Horizen.io",
    href: "https://horizen.io",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
];

export default function Footer(): React.ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logoArea}>
          <Link to="https://horizen.io" className={styles.logoLink}>
            <img
              src="/img/Logos/SVG/Horizen2.0-logo_primary-white.svg"
              alt="Horizen"
              className={styles.logo}
            />
          </Link>
        </div>

        <div className={styles.linksArea}>
          <div className={styles.column}>
            <div className={styles.columnTitle}>Horizen</div>
            <ul className={styles.columnLinks}>
              {HORIZEN_LINKS.map((link) => (
                <li key={link.label}>
                  <Link className={styles.link} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <div className={styles.columnTitle}>Docs</div>
            <ul className={styles.columnLinks}>
              {DOCS_LINKS.map((link) => (
                <li key={link.label}>
                  <Link className={styles.link} to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <div className={styles.columnTitle}>Ecosystem</div>
            <ul className={styles.columnLinks}>
              {ECOSYSTEM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link className={styles.link} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.socialArea}>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={styles.socialBtn}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© {year} Horizen. All rights reserved.</span>
        <span className={styles.bottomSep}>|</span>
        <a
          href="https://horizen.io/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bottomLink}
        >
          Terms of Use
        </a>
        <span className={styles.bottomSep}>|</span>
        <a
          href="https://horizen.io/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bottomLink}
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
