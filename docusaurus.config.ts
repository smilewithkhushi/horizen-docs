import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Horizen Documentation",
  tagline: "Build Private. Build Compliant. Build on Horizen.",
  favicon: "img/favicon-32x32.png",

  url: "https://docs.horizen.io",
  baseUrl: "/",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: 'docs',
        title: 'Horizen Documentation',
        description: 'Developer documentation for Horizen — an EVM-identical L3 on Base (Ethereum L2) using the OP Stack. Horizen adds compliant, verifiable privacy via VELA, a confidential execution coprocessor powered by Trusted Execution Environments (TEEs). Deploy standard Solidity contracts with Foundry or Hardhat (same tooling as Base/Ethereum), or build privacy-preserving apps with VELA. Mainnet chain ID: 26514. Testnet chain ID: 2651420. ZEN is the native governance token.',
      },
    ],
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/HorizenOfficial/horizen-docs/tree/main",
          routeBasePath: "/",
          exclude: [
            "1-overview/**",
            "2-vela/**",
            "3-migration/**",
            "ecosystem/**",
            "4-mainnet-migration-instructions/**",
            "5-zenrise/**",
          ],
          // showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        // TODO: Add Google Analytics
        /* gtag: {
          trackingID: "TBD",
          anonymizeIP: true,
        }, */
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/horizenbase.png",
    metadata: [
      {
        name: 'description',
        content: 'Developer documentation for Horizen — an EVM-identical L3 on Base (Ethereum L2) using the OP Stack with compliant, verifiable privacy via VELA TEE coprocessor.',
      },
      {
        name: 'keywords',
        content: 'Horizen, VELA, EVM, L3, Base, OP Stack, TEE, Trusted Execution Environment, confidential execution, privacy blockchain, ZEN token, Foundry, Hardhat, Solidity, smart contracts, DeFi, KYC, compliance, attestation',
      },
      { property: 'og:type', content: 'website' },
    ],
    navbar: {
      logo: {
        alt: "Horizen",
        src: "img/horizenlogo.png",
        srcDark: "img/horizenlogo_darkmode.png",
        href: "/",
      },
      items: [
        {
          href: "/",
          label: "Home",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "horizenChainSidebar",
          position: "left",
          label: "Horizen Chain",
        },
        {
          type: "docSidebar",
          sidebarId: "velaSidebar",
          position: "left",
          label: "VELA",
        },
        {
          type: "docSidebar",
          sidebarId: "tutorialsSidebar",
          position: "left",
          label: "Tutorials",
        },
        {
          type: "docSidebar",
          sidebarId: "migrationSidebar",
          position: "left",
          label: "Migration",
        },
        {
          type: "docSidebar",
          sidebarId: "governanceSidebar",
          position: "left",
          label: "Governance",
        },
        {
          type: "docSidebar",
          sidebarId: "zenriseSidebar",
          label: "Zenrise",
          position: "left",
        },
        {
          href: "https://github.com/HorizenOfficial/horizen-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Horizen Chain", to: "/horizen-chain/overview/what-is-horizen" },
            { label: "VELA", to: "/vela/overview/what-is-vela" },
            { label: "Tutorials", to: "/tutorials/horizen-chain/deploy-erc20" },
            { label: "Migration", to: "/migration/overview" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "Discord", href: "https://discord.gg/horizen" },
            { label: "GitHub", href: "https://github.com/HorizenOfficial" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Horizen.io", href: "https://horizen.io" },
            { label: "Whitepaper", href: "https://horizen.io/whitepaper" },
            { label: "Block Explorer", href: "https://explorer.horizen.io" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Horizen`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["solidity", "bash", "json"],
    },
    // TODO: Configure Algolia DocSearch
    /* algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    }, */
  } satisfies Preset.ThemeConfig,
};

export default config;
