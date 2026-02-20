import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '공지사항',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    to: '/docs/notice/2024-01-15',
    description: (
      <>
        업데이트, 이벤트, 안내 공지를 확인하세요.
      </>
    ),
  },
  {
    title: '자료실',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    to: '/docs/free/starter',
    description: (
      <>
        무료 다운로드 자료를 이용하세요.
      </>
    ),
  },
  {
    title: '스토어',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    href: 'https://www.latpeed.com/stores/oVjgN',
    isExternal: true,
    description: (
      <>
        자료팩, 멤버십 등 유료 자료를 구매하세요.
      </>
    ),
  },
];

function Feature({Svg, title, description, to, href, isExternal}) {
  const content = (
    <>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </>
  );

  return (
    <div className={clsx('col col--4')}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.featureLink}>
          {content}
        </a>
      ) : (
        <Link to={to} className={styles.featureLink}>
          {content}
        </Link>
      )}
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
