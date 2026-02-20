import React from 'react';

export default function StoreLink({ href, label = '스토어 이동' }) {
  const storeUrl = href || 'https://www.latpeed.com/stores/oVjgN';

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="button button--primary"
    >
      {label}
    </a>
  );
}
