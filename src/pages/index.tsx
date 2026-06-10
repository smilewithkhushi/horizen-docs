import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

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
      <div className={styles.heroOverlay} />
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          Build Private. Build Compliant.<br />Build on Horizen.
        </h1>
        <p className={styles.heroSubtitle}>
          Horizen is a privacy and compliance chain on Base. Build apps that are confidential by default and compliant by design.
        </p>
        {/* <div className={styles.heroCtas}>
          <Link className="button button--primary button--lg" to="/horizen-chain/deploy-contracts/using-foundry">
            Start Building
          </Link>
          <Link className="button button--outline button--lg" to="/vela/introduction">
            Explore VELA
          </Link>
        </div> */}
      </div>
    </section>
  );
}

function WhatIsHorizen() {
  return (
    <section className={styles.whatIsSection}>
      <div className={`container ${styles.whatIsInner}`}>
        <div className={styles.whatIsText}>
          <h2>What is Horizen?</h2>
          <p>
            Horizen is an EVM-native L3 built on Base. It adds what Base doesn't have: compliant,
            verifiable privacy. Through the Horizen Chain and VELA, developers can build apps that
            are private by default and auditable by design.
          </p>
        </div>
        <div className={styles.architectureImage}>
          <img src="/img/horizenbase.png" alt="Horizen Architecture Diagram" />
        </div>
      </div>
    </section>
  );
}

const personas = [
  {
    title: 'EVM Developer',
    description: 'Already building on Base or Ethereum? Deploy on Horizen in minutes with the same tools you use today.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
    cta: 'Deploy a contract',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Privacy-First Builder',
    description: 'Building confidential DeFi, payments, or identity apps from scratch.',
    link: '/horizen-chain/privacy-tools',
    cta: 'Explore privacy tools',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: 'Compliance Engineer',
    description: 'Gate contract actions behind AML verification for regulated markets. No new toolchain needed.',
    link: '/horizen-chain/compliance',
    cta: 'Explore compliance patterns',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
  },
];

function PersonaCards() {
  return (
    <section className={styles.personaSection}>
      <div className="container">
        <h2>Choose Your Path</h2>
        <div className={styles.personaGrid}>
          {personas.map((p) => (
            <Link key={p.title} to={p.link} className={styles.personaCard}>
              <div className={styles.personaCardIcon}>{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className={styles.personaCta}>
                {p.cta}
                <span className={styles.personaCtaArrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const quickSetupItems = [
  { label: 'Add Horizen to Your Wallet', link: '/horizen-chain/network/mainnet' },
  { label: 'Get Testnet ETH from the Faucet', link: '/horizen-chain/network/testnet' },
  { label: 'View the Block Explorer', link: '/horizen-chain/network/block-explorer' },
];

function QuickSetup() {
  return (
    <section className={styles.quickSetupSection}>
      <div className="container">
        <h2>Quick Setup</h2>
        <div className={styles.quickSetupGrid}>
          {quickSetupItems.map((item, i) => (
            <React.Fragment key={i}>
              <Link to={item.link} className={styles.quickSetupCard}>
                <span className={styles.quickSetupIndex}>0{i + 1}</span>
                <span className={styles.quickSetupLabel}>{item.label}</span>
                <span className={styles.quickSetupAction}>Get started →</span>
              </Link>
              {i < quickSetupItems.length - 1 && (
                <span className={styles.quickSetupConnector} aria-hidden="true">╌╌</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

const buildingCards = [
  {
    tag: 'EVM',
    title: 'Deploy Your First Contract',
    description: 'Standard EVM deployment on Horizen. Done in minutes with the tools you already know.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
    accent: 'linear-gradient(90deg, #FCD11A, #f0a500)',
    subLinks: [
      { label: 'Foundry', link: '/horizen-chain/deploy-contracts/using-foundry' },
      { label: 'Hardhat', link: '/horizen-chain/deploy-contracts/using-hardhat' },
    ],
  },
  {
    tag: 'VELA',
    title: 'Your First Confidential App',
    description: 'Run attested computation inside a TEE. Private by default, auditable by design.',
    link: '/vela/getting-started/hello-world',
    accent: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
    subLinks: [],
  },
  {
    tag: 'BRIDGE',
    title: 'Bridge Assets to Horizen',
    description: 'Move ETH via the native OP Stack bridge, or bridge ZEN, USDC, and cbBTC across 80+ chains via Stargate.',
    link: '/horizen-chain/bridging/how-bridging-works',
    accent: 'linear-gradient(90deg, #0ea5e9, #06b6d4)',
    subLinks: [
      { label: 'Native Bridge', link: '/horizen-chain/bridging/bridge-assets' },
      { label: 'Stargate', link: '/horizen-chain/bridging/bridge-assets-stargate' },
    ],
  },
];

function StartBuilding() {
  return (
    <section className={styles.buildSection}>
      <div className="container">
        <h2 className={styles.buildHeading}>Start Building</h2>
        <div className={styles.buildGrid}>
          {buildingCards.map((card) => (
            <Link key={card.title} to={card.link} className={styles.buildCard}>
              <span className={styles.buildTag}># {card.tag}</span>
              <h3 className={styles.buildTitle}>{card.title}</h3>
              <p className={styles.buildDesc}>{card.description}</p>
              <span className={styles.buildCta}>Get started →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const bottomLinks = [
  { label: 'Join the Discord', link: 'https://discord.gg/horizen-334085157441110017', external: true, note: null },
  { label: 'Open a GitHub Issue', link: 'https://github.com/HorizenOfficial', external: true, note: null },
  { label: 'Read the Whitepaper', link: 'https://horizen.io/whitepaper', external: true, note: null },
];

function BottomCta() {
  return (
    <section className={styles.bottomSection}>
      <div className="container">
        <h2>Need help or want to go deeper?</h2>
        <div className={styles.bottomLinks}>
          {bottomLinks.map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className={styles.bottomLink}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {item.label}
              {item.note && <span className={styles.bottomNote}>{item.note}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <Hero />
        <WhatIsHorizen />
        <PersonaCards />
        <QuickSetup />
        <StartBuilding />
        {/* <BottomCta /> */}
      </main>
    </Layout>
  );
}
