// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '소셜아카이브',
  tagline: '공지사항, 무료자료실, 스토어',
  favicon: 'img/sa_150.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://social-archive.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'social-archive', // Usually your GitHub org/user name.
  projectName: 'social-archive.github.io', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // sitemap은 classic preset에 기본 포함됨

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/social-archive/social-archive/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: '소셜아카이브 블로그',
          blogDescription: '유튜브 영상, 활용 팁, 업데이트 소식',
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl: 'https://github.com/social-archive/social-archive.github.io/tree/main/',
          blogSidebarTitle: '최근 글',
          blogSidebarCount: 5,
          onInlineTags: 'ignore',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/sa_150.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '소셜아카이브',
        logo: {
          alt: '소셜아카이브 로고',
          src: 'img/sa_150.png',
        },
        items: [
          { to: '/docs/free/starter', label: '무료자료실', position: 'left' },
          { to: '/blog', label: '블로그', position: 'left' },
          {
            href: 'https://www.latpeed.com/stores/oVjgN',
            label: '멤버십스토어',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '링크',
            items: [
              { label: '무료자료실', to: '/docs/free/starter' },
              { label: '블로그', to: '/blog' },
              {
                label: '멤버십스토어',
                href: 'https://www.latpeed.com/stores/oVjgN',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 소셜아카이브`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
