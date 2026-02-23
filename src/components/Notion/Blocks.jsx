/**
 * 노션 스타일 블록 컴포넌트
 * MDX에서 import해서 블록을 쌓듯 페이지를 구성할 수 있습니다.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import styles from './notion.module.css';

export function Page({ children, className }) {
  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function H1({ children }) {
  return <h1 className={styles.h1}>{children}</h1>;
}

export function H2({ children }) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export function H3({ children }) {
  return <h3 className={styles.h3}>{children}</h3>;
}

export function Text({ children }) {
  return <p className={styles.text}>{children}</p>;
}

export function Callout({ children, emoji = '💡' }) {
  return (
    <div className={styles.callout}>
      <span className={styles.calloutIcon}>{emoji}</span>
      <div className={styles.calloutContent}>{children}</div>
    </div>
  );
}

export function Divider() {
  return <hr className={styles.divider} />;
}

export function BulletList({ children }) {
  return <ul className={styles.bulletList}>{children}</ul>;
}

export function BulletItem({ children }) {
  return <li className={styles.bulletItem}>{children}</li>;
}

export function BlockLink({ to, href, children }) {
  const className = styles.blockLink;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <Link to={to} className={className}>{children}</Link>;
}

/** 카드 그리드 - 프로필/링크 카드용 */
export function CardGrid({ children }) {
  return <div className={styles.cardGrid}>{children}</div>;
}

export function Card({ to, href, icon, title, description }) {
  const content = (
    <div className={styles.card}>
      {icon && <span className={styles.cardIcon}>{icon}</span>}
      <span className={styles.cardTitle}>{title}</span>
      {description && <span className={styles.cardDesc}>{description}</span>}
      <span className={styles.cardArrow}>→</span>
    </div>
  );
  const className = styles.cardLink;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return <Link to={to} className={className}>{content}</Link>;
}
