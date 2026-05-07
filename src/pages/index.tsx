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
          Horizen is the privacy layer for Base — bringing confidential, auditable execution to Ethereum's most active L2.
        </p>
        <div className={styles.heroCtas}>
          <Link className="button button--primary button--lg" to="/horizen-chain/deploy-contracts/using-foundry">
            Start Building
          </Link>
          <Link className="button button--outline button--lg" to="/vela/overview/what-is-vela">
            Explore VELA
          </Link>
        </div>
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
    cta: 'Deploy a contract →',
  },
  {
    title: 'Privacy-First Builder',
    description: 'Building confidential DeFi, payments, or identity apps from scratch.',
    link: '/vela/getting-started/hello-world',
    cta: 'Start with VELA →',
  },
  {
    title: 'Enterprise Developer',
    description: 'Need compliance-ready privacy for regulated finance or institutional use.',
    link: '/vela/building/compliance-policies',
    cta: 'Explore compliance →',
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
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className={styles.personaCta}>{p.cta}</span>
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
    tag: 'MIGRATE',
    title: 'Bring Your dApp from Base',
    description: 'Already on Base? Horizen is EVM-identical. Your contracts deploy as-is.',
    link: '/tutorials/horizen-chain/bridge-from-base',
    accent: 'linear-gradient(90deg, #0ea5e9, #06b6d4)',
    subLinks: [],
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
              <span className={styles.buildTag}>$ {card.tag}</span>
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
  { label: 'Join the Discord', link: 'https://discord.gg/horizen', external: true, note: null },
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
