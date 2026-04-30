import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
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
  {
    title: 'Node Operator',
    description: 'Running infrastructure or integrating at the protocol level.',
    link: '/horizen-chain/architecture/system-overview',
    cta: 'View architecture →',
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
        <div className={styles.quickSetupList}>
          {quickSetupItems.map((item, i) => (
            <Link key={i} to={item.link} className={styles.quickSetupItem}>
              <span className={styles.quickSetupNumber}>{String(i + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
              <span className={styles.quickSetupArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const buildingCards = [
  {
    title: 'Deploy Your First Contract',
    description: 'Standard EVM deployment on Horizen. Done in minutes.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
    subLinks: [
      { label: 'Foundry', link: '/horizen-chain/deploy-contracts/using-foundry' },
      { label: 'Hardhat', link: '/horizen-chain/deploy-contracts/using-hardhat' },
    ],
  },
  {
    title: 'Your First Confidential App with VELA',
    description: 'Run attested computation inside a TEE.',
    link: '/vela/getting-started/hello-world',
    subLinks: [],
  },
  {
    title: 'Migrate from Base',
    description: 'Already on Base? Bring your dApp to Horizen.',
    link: '/tutorials/horizen-chain/bridge-from-base',
    subLinks: [],
  },
];

function StartBuilding() {
  return (
    <section className={styles.buildSection}>
      <div className="container">
        <h2>Start Building</h2>
        <div className={styles.buildGrid}>
          {buildingCards.map((card) => (
            <div key={card.title} className={styles.buildCard}>
              <h3>
                <Link to={card.link}>{card.title}</Link>
              </h3>
              <p>{card.description}</p>
              {card.subLinks.length > 0 && (
                <div className={styles.buildSubLinks}>
                  {card.subLinks.map((sub) => (
                    <Link key={sub.label} to={sub.link} className={styles.buildSubLink}>
                      {sub.label} →
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
  { label: 'Thrive Builder Program', link: '/ecosystem/builder-program/thrive-overview', external: false, note: 'coming late summer 2026' },
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
        <BottomCta />
      </main>
    </Layout>
  );
}
