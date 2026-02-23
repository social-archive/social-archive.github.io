// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '소셜아카이브',
  tagline: 'AI 콘텐츠 · 자료실 · 강의 · 스토어를 하나로 연결한 허브',
  favicon: 'img/logo_1000x1000.png',

  future: {
    v4: true,
  },

  url: 'https://social-archive.github.io',
  baseUrl: '/',

  organizationName: 'social-archive',
  projectName: 'social-archive.github.io',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  clientModules: [require.resolve('./src/gtag-stub.js')],

  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;',
    },
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['ko'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        searchResultLimits: 8,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/social-archive/social-archive.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: '소셜아카이브 블로그',
          blogDescription: '콘텐츠 운영 팁, 업데이트 노트, AI 활용 인사이트',
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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-QQBV4FLKC7',
          anonymizeIP: true,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo_1000x1000.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '소셜아카이브',
        logo: {
          alt: '소셜아카이브 로고',
          src: 'img/logo_1000x1000.png',
        },
        items: [
          { to: '/docs/free/starter', label: '자료실', position: 'left' },
          { to: '/docs/notice/2024-02-01', label: '공지사항', position: 'left' },
          { to: '/blog', label: '블로그', position: 'left' },
          {
            href: 'https://inf.run/jiXTj',
            label: '인프런 강의',
            position: 'right',
          },
          {
            href: 'https://www.latpeed.com/stores/oVjgN',
            label: '스토어',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '콘텐츠',
            items: [
              { label: '자료실', to: '/docs/free/starter' },
              { label: '공지사항', to: '/docs/notice/2024-02-01' },
              { label: '블로그', to: '/blog' },
            ],
          },
          {
            title: '서비스',
            items: [
              { label: '인프런 강의', href: 'https://inf.run/jiXTj' },
              { label: '멤버십 스토어', href: 'https://www.latpeed.com/stores/oVjgN' },
            ],
          },
          {
            title: '정책',
            items: [
              { label: '개인정보 처리방침', to: '/privacy-policy' },
              { label: '이용약관', to: '/terms' },
            ],
          },
          {
            title: '사업자 정보',
            items: [
              { html: '<span class="biz-meta">상호명: 소셜아카이브</span>' },
              { html: '<span class="biz-meta">대표자: 서정욱</span>' },
              { html: '<span class="biz-meta">주소: 서울특별시 신림동 19-3 믿음하우스 1003호</span>' },
              { html: '<span class="biz-meta">전화: 01042215066</span>' },
              { html: '<span class="biz-meta">메일: dj500dj100@gmail.com</span>' },
              { html: '<span class="biz-meta">사업자등록번호: 634-17-02226</span>' },
              { html: '<span class="biz-meta">통신판매신고번호: 2025-서울관악-1441</span>' },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Social Archive. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
