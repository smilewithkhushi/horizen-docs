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
            { label: "Migration", to: "/migration/01-overview" },
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
