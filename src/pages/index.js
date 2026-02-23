/**
 * 랜딩 페이지 - Notion Markdown 내보내기로 작성한 MDX 렌더링
 *
 * Notion에서 Export → Markdown으로 내보낸 후
 * src/pages/_home.mdx 내용을 교체하면 됩니다.
 */
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomeContent from '@site/src/pages/_home.mdx';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <HomeContent />
        </div>
      </main>
    </Layout>
  );
}
