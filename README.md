# 소셜 아카이브

소셜 미디어 포스트를 모아두는 아카이브 사이트입니다. Astro로 구축되었으며 GitHub Pages에 배포됩니다.

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

개발 서버: http://localhost:4321

## 📦 빌드

```bash
npm run build
npm run preview  # 배포 전 미리보기
```

## 🚢 GitHub Pages 배포

### 1. GitHub Pages 설정

1. 저장소 **Settings** → **Pages** 이동
2. **Build and deployment**에서 **Source**를 **GitHub Actions**로 선택

### 2. 자동 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 배포합니다.

- **수동 실행**: Actions 탭 → "Deploy to GitHub Pages" → "Run workflow"

### 3. 배포 URL

```
https://social-archive.github.io
```

## 📁 프로젝트 구조

```
├── .github/workflows/
│   └── deploy.yml      # GitHub Actions 배포 워크플로우
├── public/
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── astro.config.mjs
```
