import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const algoliaConfig = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY && process.env.ALGOLIA_INDEX_NAME
  ? {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      contextualSearch: true,
      searchPagePath: 'search' as const,
    }
  : undefined;

const config: Config = {
  title: "Horizen Documentation",
  tagline: "Build Private. Build Compliant. Build on Horizen.",
  favicon: "img/Logos/PNG/Horizen2.0-logo_icon-on-yellow.png",

  url: "https://docs.horizen.io",
  baseUrl: "/",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
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
            "tutorials/vela/**",
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
    image: "img/Logos/PNG/Horizen2.0-logo_primary-dark.png",
    metadata: [
      {
        name: 'description',
        content: 'Deploy smart contracts, bridge assets, and build privacy-preserving apps on Horizen — an EVM-identical L3 on Base powered by the OP Stack.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Deploy smart contracts, bridge assets, and build privacy-preserving apps on Horizen — an EVM-identical L3 on Base powered by the OP Stack.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@HorizenOfficial' },
    ],
    navbar: {
      logo: {
        alt: "Horizen",
        src: "img/Logos/SVG/Horizen2.0-logo_primary-dark.svg",
        srcDark: "img/Logos/SVG/Horizen2.0-logo_primary-dark.svg",
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
          href: "https://github.com/HorizenOfficial/horizen-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `© ${new Date().getFullYear()} Horizen. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["solidity", "bash", "json"],
    },
    ...(algoliaConfig && { algolia: algoliaConfig }),
  } satisfies Preset.ThemeConfig,
};

export default config;
