import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { profiles } from '@site/src/data/profiles';
import styles from './index.module.css';

function ProfileLink({ profile }) {
  const content = (
    <>
      <span className={styles.icon}>{profile.icon}</span>
      <span className={styles.title}>{profile.title}</span>
      <span className={styles.desc}>{profile.description}</span>
    </>
  );

  if (profile.href) {
    return (
      <a href={profile.href} target="_blank" rel="noopener noreferrer" className={styles.card}>
        {content}
      </a>
    );
  }

  return (
    <Link to={profile.to} className={styles.card}>
      {content}
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.main}>
        <section className={styles.grid}>
          {profiles.map((profile) => (
            <ProfileLink key={profile.id} profile={profile} />
          ))}
        </section>
      </main>
    </Layout>
  );
}
