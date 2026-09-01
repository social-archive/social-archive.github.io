# Bachata Framebook

GitHub Pages에서 동작하는 WebM 중심의 동작 분석 플레이어입니다. 조회는 비디오로 하고, 방향키나 이동 버튼으로 0.1초씩 세밀하게 탐색할 수 있습니다. 기존 이미지 시퀀스도 계속 지원합니다.

## WebM 영상 추가하기

영상을 `videos/` 폴더에 넣고 `tutorials.json`에 등록합니다.

```json
{
  "id": "body-wave-video",
  "title": "Body Wave Tutorial",
  "instagram": "https://www.instagram.com/reel/xxxxx/",
  "style": "Sensual",
  "level": "초급",
  "tags": ["body-wave", "isolation"],
  "videoPath": "videos/body-wave.webm",
  "thumbnail": "thumbnails/body-wave.jpg"
}
```

`thumbnail`은 선택 사항입니다. 배속은 0.1×~2×, 이동 간격은 0.1·0.2·0.5·1초, 루프는 반복/한 번 재생을 지원합니다.

## 0.1초 간격 이미지 시퀀스

이미지를 `frames/튜토리얼-id/0001.jpg` 형식으로 저장하고 아래 필드를 사용합니다.

```json
{
  "frameCount": 64,
  "framePath": "frames/body-wave/",
  "padding": 4,
  "extension": "jpg",
  "frameInterval": 0.1
}
```

## 로컬 실행

```powershell
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.
