# Bachata Framebook

GitHub Pages에서 무료로 동작하는 정적 프레임 플레이어입니다. 서버, 데이터베이스, 빌드 과정이 없습니다.

## 내 튜토리얼 추가하기

1. `frames/튜토리얼-id/` 폴더에 `0001.jpg`, `0002.jpg`처럼 프레임을 넣습니다.
2. `tutorials.json` 배열에 항목을 추가합니다.

```json
{
  "id": "body-wave-001",
  "title": "Body Wave Tutorial",
  "instagram": "https://www.instagram.com/reel/xxxxx/",
  "style": "Sensual",
  "level": "초급",
  "tags": ["body-wave", "isolation"],
  "frameCount": 64,
  "framePath": "frames/body-wave-001/",
  "padding": 4,
  "extension": "jpg"
}
```

파일명이 `001.jpg` 형식이면 `padding`을 `3`으로 바꿉니다. PNG라면 `extension`을 `png`로 바꿉니다.

## 로컬에서 확인하기

`tutorials.json`을 불러오기 때문에 HTML 파일을 더블클릭하지 말고 간단한 로컬 서버로 실행합니다.

```powershell
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

## GitHub Pages 배포

저장소의 **Settings → Pages → Build and deployment**에서 `Deploy from a branch`, `main`, `/ (root)`를 선택합니다.
