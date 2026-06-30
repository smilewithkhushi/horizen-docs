import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

/* ─── Hero ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        src="/img/ascii-liquid.webm"
      />
      {/* <div className={styles.heroOverlay} /> */}
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Build Private.<br />
            Build Compliant.<br />
            Build on Horizen.
          </h1>
          <p className={styles.heroSubtitle}>
            Horizen is an EVM-compatible L3 on Base for private onchain finance.
            Build with the tools you already use, and add confidentiality where your app needs it.
          </p>
        </div>
        <div className={styles.heroGraphic} aria-hidden="true">
          <div className={styles.heroRing} style={{ '--size': '320px' } as React.CSSProperties} />
          <div className={styles.heroRing} style={{ '--size': '240px' } as React.CSSProperties} />
          <div className={styles.heroRing} style={{ '--size': '160px' } as React.CSSProperties} />
          <div className={styles.heroRingCore} />
          <img
            src="/img/Logos/SVG/Horizen2.0-logo_icon-white.svg"
            className={styles.heroRingIcon}
            alt=""
          />
        </div>
      </div>
      
     
    </section>
  );
}

/* ─── What is Horizen ───────────────────────────────────────────────────── */
const features = ['Compliant', 'Verifiable', 'Opt-in Privacy'];

function WhatIsHorizen() {
  return (
    <section className={styles.whatIsSection}>
      <div className={styles.whatIsInner}>
        <div className={styles.whatIsCol}>
          <h2 className={styles.whatIsHeading}>What is Horizen?</h2>
        </div>
        <div className={styles.whatIsCol}>
          <p className={styles.whatIsPillsLabel}>It adds what Base doesn't have:</p>
          <div className={styles.featurePills}>
            {features.map((f) => (
              <span key={f} className={styles.featurePill}>{f}</span>
            ))}
          </div>
        </div>
        <div className={styles.whatIsCol}>
          <p className={styles.whatIsText}>
            Through the Horizen Chain and its confidentiality tooling, you ship a standard
            Solidity dApp and choose the privacy primitive that fits.{' '}
            <strong>No mandated stack, no new language.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── L3 Banner ─────────────────────────────────────────────────────────── */
function L3Banner() {
  return (
    <div className={styles.l3Banner}>
      <span className={styles.l3BannerText}>
        Horizen is an EVM-compatible L3 built on{' '}
        <span className={styles.l3BaseWord}>
          <span className={styles.l3BaseSquare}>
            <span className={styles.l3BaseSquareInner}></span>
            </span>base
        </span>
      </span>
    </div>
  );
}

/* ─── Choose Your Path ──────────────────────────────────────────────────── */
const personas = [
  {
    title: 'EVM Developer',
    description: 'Already building on Base or Ethereum? Deploy on Horizen in minutes with the same tools you use today.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
    cta: 'Explore a Tutorial',
    icon: (
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="70" height="70" rx="14" fill="#1038BB"/>
<path d="M29.1667 32.0834L26.25 35L29.1667 37.9167" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40.8335 32.0834L43.7502 35L40.8335 37.9167" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.9998 49.5833C43.054 49.5833 49.5832 43.0541 49.5832 35C49.5832 26.9458 43.054 20.4166 34.9998 20.4166C26.9457 20.4166 20.4165 26.9458 20.4165 35C20.4165 43.0541 26.9457 49.5833 34.9998 49.5833Z" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.4582 31.6019L33.5415 38.3978" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    ),
  },
  {
    title: 'Privacy-First Builder',
    description: 'Building confidential DeFi, payments, or identity apps from scratch.',
    link: '/horizen-chain/privacy-tools',
    cta: 'Explore Privacy Tools',
    icon: (
     <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="70" height="70" rx="14" fill="#1038BB"/>
<path d="M32.7981 20.752L25.5211 23.4937C23.844 24.1208 22.4731 26.1041 22.4731 27.8833V38.7187C22.4731 40.4395 23.6106 42.6999 24.9961 43.7354L31.2669 48.4166C33.3231 49.9624 36.7065 49.9624 38.7627 48.4166L45.0336 43.7354C46.419 42.6999 47.5565 40.4395 47.5565 38.7187V27.8833C47.5565 26.0895 46.1856 24.1062 44.5086 23.4791L37.2315 20.752C35.9919 20.2999 34.0086 20.2999 32.7981 20.752Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.6978 34.8104L33.0457 37.1583L39.3165 30.8875" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    ),
  },
  {
    title: 'Compliance Engineer',
    description: 'Gate contract actions behind AML verification for regulated markets. No new toolchain needed.',
    link: '/horizen-chain/compliance',
    cta: 'Explore Compliance Patterns',
    icon: (
     <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="70" height="70" rx="14" fill="#1038BB"/>
<path d="M31.0771 38.9375L33.2646 41.125L39.098 35.2916" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.4832 20.4166H32.0832C30.6248 20.4166 29.1665 20.4166 29.1665 23.3333C29.1665 26.25 30.6248 26.25 32.0832 26.25H37.9165C40.8332 26.25 40.8332 24.7916 40.8332 23.3333C40.8332 20.4166 39.3748 20.4166 37.9165 20.4166" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.875 32.0834C21.875 25.4334 24.3104 23.625 29.1667 23.3625" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40.8333 23.3625C45.6896 23.625 48.125 25.4188 48.125 32.0834V40.8334C48.125 46.6667 46.6667 49.5834 39.375 49.5834H30.625C23.3333 49.5834 21.875 46.6667 21.875 40.8334V37.7855" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    ),
  },
];

function PersonaCards() {
  return (
    <section className={styles.personaSection}>
      <h2 className={styles.sectionHeading}>Choose Your Path</h2>
      <div className={styles.personaGrid}>
        {personas.map((p) => (
          <div key={p.title} className={styles.personaCard}>
            <div className={styles.personaCardIcon}>{p.icon}</div>
            <h3 className={styles.personaCardTitle}>{p.title}</h3>
            <p className={styles.personaCardDesc}>{p.description}</p>
            <Link to={p.link} className={styles.personaCardBtn}>{p.cta}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Quick Setup ───────────────────────────────────────────────────────── */
const quickSetupItems = [
  { label: 'Add Horizen to Your Wallet', link: '/horizen-chain/network/mainnet' },
  { label: 'Get Testnet ETH from the Faucet', link: '/horizen-chain/network/testnet' },
  { label: 'View the Block Explorer', link: '/horizen-chain/network/block-explorer' },
];

function QuickSetup() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className={styles.quickSetupSection}>
      <h2 className={styles.sectionHeading}>Quick Setup</h2>
      <div className={styles.quickSetupList}>
          {quickSetupItems.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`${styles.quickSetupRow} ${active === i ? styles.quickSetupRowActive : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className={styles.quickSetupNum}>0{i + 1}</span>
              <span className={styles.quickSetupLabel}>{item.label}</span>
              <span className={`${styles.quickSetupIndicator} ${active === i ? styles.quickSetupIndicatorActive : ''}`} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
    </section>
  );
}

/* ─── Start Building ────────────────────────────────────────────────────── */
const buildingCards = [
  {
    tag: 'EVM',
    title: 'Deploy Your First Contract',
    description: 'Standard EVM deployment on Horizen. Done in minutes with the tools you already know.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
  },
  {
    tag: 'VELA',
    title: 'Your First Confidential App',
    description: 'Run attested computation inside a TEE. VELA is an emerging confidential coprocessor — start with a hello-world build and engage early.',
    link: '/vela/getting-started/hello-world',
  },
  {
    tag: 'BRIDGE',
    title: 'Bridge Assets to Horizen',
    description: 'Move ETH via the native OP Stack bridge, or bridge supported assets via Stargate.',
    link: '/horizen-chain/bridging/how-bridging-works',
  },
];

function StartBuilding() {
  return (
    <section className={styles.buildSection}>
      <h2 className={styles.sectionHeading}>Start Building</h2>
      <div className={styles.buildGrid}>
        {buildingCards.map((card) => (
          <div key={card.title} className={styles.buildCard}>
            <span className={styles.buildTag}>{card.tag}</span>
            <h3 className={styles.buildTitle}>{card.title}</h3>
            <p className={styles.buildDesc}>{card.description}</p>
            <Link to={card.link} className={styles.buildBtn}>Get Started</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter ────────────────────────────────────────────────────────── */
function Newsletter() {
  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterInner}>
        <span className={styles.newsletterLabel}>Sign Up for Newsletter</span>
        <div className={styles.newsletterForm}>
          <input
            type="text"
            placeholder="Name"
            className={styles.newsletterInput}
            aria-label="Name"
          />
          <input
            type="email"
            placeholder="Email address"
            className={styles.newsletterInput}
            aria-label="Email address"
          />
          <button type="button" className={styles.newsletterBtn}>Subscribe</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <Hero />
        <div className={styles.heroSpacer} />
        <WhatIsHorizen />
        <L3Banner />
        <PersonaCards />
        <QuickSetup />
        <StartBuilding />
        <Newsletter />
      </main>
    </Layout>
  );
}
