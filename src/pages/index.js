/**
 * 랜딩 페이지 - 멀티프로필 허브
 *
 * 멀티프로필이 메인 컨셉입니다.
 * profiles 배열에 프로필을 추가하면 카드가 자동으로 늘어납니다.
 * 각 프로필: title, description, to(내부) 또는 href(외부), icon, external
 */
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Heading from '@theme/Heading';
import styles from './index.module.css';

/** 멀티프로필 목록 - 프로필 추가 시 이 배열만 수정 */
const profiles = [
  {
    id: 'youtube',
    title: '유튜브',
    description: '영상 콘텐츠와 활용 팁을 확인하세요.',
    href: 'https://www.youtube.com/@social_archive_kr',
    icon: '▶️',
    external: true,
  },
  {
    id: 'instagram',
    title: '인스타그램',
    description: '소식을 인스타에서 만나보세요.',
    href: 'https://www.instagram.com/social_archive0211/',
    icon: '📷',
    external: true,
  },
  {
    id: 'kakao',
    title: '카카오톡',
    description: '카카오톡 채널로 문의하세요.',
    href: 'https://pf.kakao.com/_BxnIFn',
    icon: '💬',
    external: true,
  },
  {
    id: 'free',
    title: '무료자료실',
    description: '템플릿, 가이드 등 무료 자료를 다운로드하세요.',
    to: '/docs/free/starter',
    icon: '📦',
  },
  {
    id: 'blog',
    title: '블로그',
    description: '유튜브 영상, 활용 팁, 업데이트 소식을 확인하세요.',
    to: '/blog',
    icon: '✏️',
  },
  {
    id: 'inflearn',
    title: '인프런 강의',
    description: 'AI 활용 100프롬프트 기초 입문 강의를 수강하세요.',
    href: 'https://inf.run/jiXTj',
    icon: '🎓',
    external: true,
  },
  {
    id: 'store',
    title: '멤버십스토어',
    description: '자료팩, 멤버십 등 유료 콘텐츠를 구매하세요.',
    href: 'https://www.latpeed.com/stores/oVjgN',
    icon: '🛒',
    external: true,
  },
];

function ProfileCard({ title, description, to, href, icon, external }) {
  const content = (
    <div className={styles.card}>
      <span className={styles.cardIcon}>{icon}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDesc}>{description}</p>
      <span className={styles.cardArrow}>→</span>
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardLink}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={styles.cardLink}>
      {content}
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const logoUrl = useBaseUrl('/img/sa_150.png');

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.landing}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <img
              src={logoUrl}
              alt={siteConfig.title}
              className={styles.heroLogo}
            />
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            {/* <p className={styles.heroSubtitle}>
              멀티프로필 허브
            </p>
            <p className={styles.heroDesc}>
              인스타 · 카톡 · 유튜브 · 무료자료실 · 블로그 · 인프런 · 스토어를 한곳에서
            </p> */}
          </div>
        </section>

        <section className={styles.profiles} aria-label="멀티프로필">
          {/* <h2 className={styles.profilesHeading}>프로필 선택</h2> */}
          <div className={styles.profilesGrid}>
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} {...profile} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
