/**
 * daily-quest-parts.json — 각 축 100개 (앞부분은 기존 시드 유지).
 * 실행: node scripts/build-daily-quest-100.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const target = path.join(root, 'src', 'data', 'daily-quest-parts.json');

const SEED_LEN = { missions: 36, emotions: 34, constraints: 35, executions: 35 };

function uniqByKo(items) {
	const seen = new Set();
	return items.filter((x) => {
		const k = x.ko.trim();
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}

function padTo100(seed, generator, label) {
	let out = uniqByKo([...seed]);
	let round = 0;
	while (out.length < 100 && round < 800) {
		const add = generator(200);
		out = uniqByKo([...out, ...add]);
		round++;
	}
	if (out.length < 100) {
		throw new Error(`${label}: only ${out.length} unique items`);
	}
	return out.slice(0, 100);
}

/* ---------- 미션 8×8 그리드 + 엑스트라 ---------- */
const mTime = ['새벽', '한낮', '황혼', '한밤', '비 오는', '눈 내리는', '안개 낀', '맑은 날의'];
const mTimeEn = ['dawn', 'midday', 'dusk', 'late night', 'rainy', 'snowy', 'foggy', 'clear day'];
const mPlace = ['지하철', '택시 뒷좌석', '옥상', '복도', '연습실', '녹음실', '방송 대기실', '편의점 앞'];
const mPlaceEn = ['subway', 'taxi back seat', 'rooftop', 'corridor', 'practice room', 'recording booth', 'broadcast waiting room', 'convenience store front'];
const mBeat = [
	'말 없이 스치는 감정만 남긴',
	'누군가를 기다리다 시선이 흐트러진',
	'거짓말을 삼키기 직전의',
	'작별 인사를 삼키기 직전의',
	'박수 소리가 울리기 직전의',
	'거울과 눈이 마주친',
	'문 손잡이에 손이 닿기 직전의',
	'카메라가 켜지기 직전의',
];
const mBeatEn = [
	'silent emotions only',
	'waiting gaze drifting',
	'moment before swallowing a lie',
	'moment before swallowing goodbye',
	'moment before applause',
	'eyes meeting mirror',
	'hand on door handle',
	'moment before camera rolls',
];

function genMissions() {
	const rows = [];
	for (let t = 0; t < mTime.length; t++) {
		for (let p = 0; p < mPlace.length; p++) {
			const bi = (t + p) % mBeat.length;
			rows.push({
				ko: `${mTime[t]} ${mPlace[p]}에서 ${mBeat[bi]} 한 컷`,
				en: `${mTimeEn[t]} ${mPlaceEn[p]}, ${mBeatEn[bi]}, single cinematic frame`,
			});
		}
	}
	const extra = [
		{
			ko: '첫 리허설과 막공의 같은 동선을 한 이미지에 겹쳐 보이게',
			en: 'same blocking rehearsal vs finale, layered or ghosted double exposure',
		},
		{
			ko: '방송 사인만 보이고 얼굴은 프레임 밖—팬과의 거리만 느껴지게',
			en: 'idol autograph hand only, face out of frame, fan distance implied',
		},
		{
			ko: '댄스 브레이크 직전 호흡만 클로즈업 (몸은 일부만)',
			en: 'breath close-up before dance break, body fragment only',
		},
		{
			ko: '라이브 하우스 무대 아래 케이블과 물병만—방금 있었던 열기만',
			en: 'stage floor cables and water bottles only, heat of show implied',
		},
		{
			ko: '팬레터 봉투 가장자리와 떨리는 손끝만',
			en: 'fan letter envelope edge and trembling fingertips',
		},
		{
			ko: '헤어스프레이 안개 속 실루엣만 선명하게',
			en: 'hairspray mist, silhouette sharp inside haze',
		},
		{
			ko: '피아노 건반 위 손가락 하나만 초점, 나머지는 녹아내리게',
			en: 'one piano key finger in focus, rest melts away',
		},
		{
			ko: '촬영 대본에만 밑줄 친 대사—입은 열리지 않게',
			en: 'script underline on one line, mouth not opening',
		},
	];
	return [...rows, ...extra];
}

/* ---------- 감정 11×11 + 엑스트라 ---------- */
const eA = ['서늘한', '달큰한', '뜨거운', '무거운', '가벼운', '뾰족한', '둥글게 감춘', '얇게 드러난', '깊게 새긴', '흐릿한', '날 선'];
const eAen = ['cool', 'warm', 'hot', 'heavy', 'light', 'sharp', 'softly hidden', 'thinly revealed', 'deeply etched', 'hazy', 'edgy'];
const eB = ['기대', '미안함', '질투', '동경', '체념', '안도', '불안', '그리움', '수치', '자부심', '허무'];
const eBen = ['expectation', 'guilt', 'jealousy', 'admiration', 'resignation', 'relief', 'anxiety', 'longing', 'shame', 'pride', 'emptiness'];

function genEmotions() {
	const rows = [];
	for (let a = 0; a < eA.length; a++) {
		for (let b = 0; b < eB.length; b++) {
			rows.push({
				ko: `${eA[a]} ${eB[b]}`,
				en: `${eAen[a]} ${eBen[b]}, emotional undertone`,
			});
		}
	}
	const extra = [
		{ ko: '입술을 깨물며 참는 애정', en: 'biting lip holding back affection' },
		{ ko: '웃음이 얼어붙는 순간의 공포', en: 'terror as smile freezes' },
		{ ko: '남의 행복을 진심으로 빌어주는 서운함', en: 'sincere well-wish tinged with hurt' },
		{ ko: '익숙한 손길이 낯설어진 순간', en: 'familiar touch suddenly alien' },
		{ ko: '끝내 말하지 못한 고마움', en: 'gratitude never spoken' },
		{ ko: '끝내 말하지 못한 미안함', en: 'apology never spoken' },
		{ ko: '스스로를 탓하는 순간의 온기', en: 'warmth mixed with self-blame' },
		{ ko: '누군가의 실패를 자기 탓으로 받아들이는 마음', en: "taking someone else's failure as own fault" },
	];
	return [...rows, ...extra];
}

/* ---------- 제약: 주제 + 규칙 (조사 고정) ---------- */
const cTopic = [
	{ ko: '인물', en: 'figure' },
	{ ko: '배경', en: 'background' },
	{ ko: '광원', en: 'light source' },
	{ ko: '색', en: 'color' },
	{ ko: '질감', en: 'texture' },
	{ ko: '초점', en: 'focus' },
	{ ko: '프레임', en: 'frame edge' },
	{ ko: '시간', en: 'time' },
	{ ko: '움직임', en: 'motion' },
	{ ko: '상징', en: 'symbol' },
];
const cParticle = ['은', '은', '은', '은', '은', '은', '은', '은', '은', '은'];

const cRuleKo = [
	' 화면의 1/3 이하만 차지하게',
	' 의도적으로 과노출로 날리게',
	' 실루엣으로만 읽히게',
	' 단색 면으로 단순화해',
	' 프레임 밖에서만 암시되게',
	' 대각선으로만 배치해',
	' 프레임 중심에서 비우고 가장자리에만 두게',
	' 흐릿한 레이어로만 등장하게',
	' 반복 패턴으로만 표현해',
	' 한 가지 색의 농도 변화로만 묘사해',
];
const cRuleEn = [
	'occupies at most one third of the frame',
	'blown out with intentional overexposure',
	'read only as silhouette',
	'simplified to flat color planes',
	'implied only outside the frame',
	'placed only on diagonals',
	'emptied from center pushed to edges',
	'appears only as soft layered blur',
	'expressed only as repeating pattern',
	'rendered only by one color value steps',
];

function genConstraints() {
	const rows = [];
	for (let i = 0; i < cTopic.length; i++) {
		for (let j = 0; j < cRuleKo.length; j++) {
			const t = cTopic[i];
			rows.push({
				ko: `${t.ko}${cParticle[i]}${cRuleKo[j]}`,
				en: `${t.en}: ${cRuleEn[j]}`,
			});
		}
	}
	const more = [
		{ ko: '대지의 질감(종이·캔버스)이 피사체와 동등한 비중을 갖게', en: 'substrate texture equal weight to subject' },
		{ ko: '인물이 있더라도 ‘시선의 목표’는 항상 화면 밖', en: 'gaze target always off-frame even if figure present' },
		{ ko: '하이라이트는 딱 한 점만 허용', en: 'single highlight point only' },
		{ ko: '그림자는 부드럽게, 경계선은 단 하나만 날카롭게', en: 'soft shadows one hard edge only' },
		{ ko: '원근법은 망가져도 되지만 ‘한 줄기’ 수직은 지키게', en: 'broken perspective but one true vertical' },
		{ ko: '초점 심도는 얕게—배경은 색 덩어리로만', en: 'shallow DOF background as color mass only' },
		{ ko: '프레임 안에 ‘문’이나 ‘창’은 하나만', en: 'at most one door or window in frame' },
		{ ko: '인물 수는 최대 둘—셋 이상이면 실루엣으로 합치기', en: 'max two figures or merge extras as silhouettes' },
		{ ko: '빛의 색은 한 종류—그림자만 다른 색온도 허용', en: 'one light color temperature shadows may contrast' },
		{ ko: '질감 대비: 매끈한 것 하나와 거친 것 하나만', en: 'texture contrast one smooth one rough only' },
		{ ko: '수평선은 끊기게—연속되지 않게', en: 'broken horizon not continuous' },
		{ ko: '대칭축이 있어도 ‘한 점’만 의도적으로 어긋나게', en: 'symmetry with one deliberate off-center point' },
		{ ko: '텍스트가 있으면 손글씨 느낌만—인쇄체 금지', en: 'handwritten text only if any no print fonts' },
		{ ko: '비 오는 날이면 유리에만 초점—밖은 추상적으로', en: 'rain focus on glass outside abstract' },
		{ ko: '야경이면 네온은 하나의 색만', en: 'night scene single neon hue only' },
	];
	return [...more, ...rows];
}

/* ---------- 표현: 한글 + 영문 키워드 쌍 ---------- */
const execPairs = [
	['인상파 느슨한 붓터치', 'impressionist loose brushwork'],
	['바로크 극적인 광원', 'baroque dramatic lighting'],
	['아르누보 곡선 장식', 'art nouveau ornamental curves'],
	['브루탈리스트 단색 면', 'brutalist flat planes'],
	['리소그래프 인쇄 번짐', 'risograph misregistration'],
	['스크린프린트 레이어', 'screenprint layered inks'],
	['초크 파스텔 가루', 'chalk pastel dust'],
	['수채화 구아슈', 'gouache opaque watercolor'],
	['숯 드로잉 스머지', 'charcoal smudge drawing'],
	['마카 렌더', 'alcohol marker render'],
	['펠트펜 선', 'felt tip line art'],
	['스텐실 스프레이', 'stencil spray paint'],
	['자수 질감', 'embroidery thread texture'],
	['도자기 유약 광택', 'ceramic glaze sheen'],
	['스테인드글라스 색면', 'stained glass color fields'],
	['종이 오리기 실루엣', 'paper cut silhouette'],
	['벡터 플랫', 'vector flat illustration'],
	['로우폴리 3D', 'low poly 3D render'],
	['클레이 스톱모션 정지', 'clay stop-motion still'],
	['펠트 인형 질감', 'felt puppet texture'],
	['코믹 잉크 워시', 'comic ink wash'],
	['만화 잉크 강한 대비', 'manhwa ink high contrast'],
	['패션 크로키', 'fashion croquis'],
	['건축 도면 오버레이', 'architectural blueprint overlay'],
	['청사진 라인', 'blueprint line art'],
	['열화상 팔레트', 'thermal imaging palette'],
	['적외선 의색', 'infrared false color'],
	['이중노출 사진', 'double exposure photograph'],
	['틸트시프트 미니어처', 'tilt-shift miniature look'],
	['매크로 제품샷', 'macro product shot'],
	['틸 오렌지 블록버스터 그레이딩', 'teal orange blockbuster grade'],
	['대칭 구도 웨스 앤더슨', 'symmetrical Wes Anderson framing'],
	['네온 왕가위', 'neon soaked Wong Kar-wai mood'],
	['원포인트 쿠브릭', 'one-point Kubrick perspective'],
	['타르코프스키 정적 장면', 'Tarkovsky meditative still'],
	['지브리 배경 수채', 'Ghibli style watercolor background'],
	['90년대 OVA 애니', '90s anime OVA cel look'],
	['베이퍼웨이브', 'vaporwave aesthetic'],
	['신스웨이브', 'synthwave neon grid'],
	['로파이 앨범커버', 'lo-fi album cover layout'],
	['인디 진 제록스', 'indie zine xerox texture'],
	['공연 포스터 실크스크린', 'gig poster silkscreen'],
	['LP 슬리브', 'LP record sleeve layout'],
	['CD 북릿', 'CD booklet spread'],
	['카세트 J카드', 'cassette J-card graphic'],
	['신문 사진 하프톤', 'newspaper halftone photo'],
	['잡지 찢어 붙임', 'magazine tear collage'],
	['컨택시트', 'contact sheet photo grid'],
	['CCTV 알갱이', 'CCTV grainy footage'],
	['도어벨캠 어안', 'doorbell fisheye cam'],
	['야생카메라 야간', 'trail cam night vision'],
	['위성 사진 감성', 'satellite photo aesthetic'],
	['등고선 지도', 'topographic contour map'],
	['인포그래픽 미니멀', 'minimal infographic'],
	['이모지 콜라주', 'emoji collage'],
	['스티커 밤', 'sticker bomb surface'],
	['마스킹테이프', 'washi tape collage'],
	['종이접기 접힘선', 'origami fold lines'],
	['퀼트 패치워크', 'quilt patchwork'],
	['십자수', 'cross stitch texture'],
	['모자이크 타일', 'mosaic tile pattern'],
	['프레스코 크랙클', 'fresco crackle'],
	['딥팩트 밀랍', 'encaustic wax depth'],
	['에어브러시 80년대', '1980s airbrush illustration'],
	['크롬 타이포 시대', 'chrome typography era'],
	['Y2K 글로시', 'Y2K glossy plastic'],
	['그런지 90년대', '1990s grunge print'],
	['이모 마이스페이스', 'emo Myspace era'],
	['텀블러 소프트', 'soft Tumblr aesthetic'],
	['핀터레스트 무드보드', 'Pinterest mood board'],
	['인스타 필터 바랜', 'faded Instagram filter'],
	['폴라로이드 SX-70', 'Polaroid SX-70 instant'],
	['8mm 필름 프레임', '8mm film frame border'],
	['16mm 아카데미', '16mm academy film still'],
	['아이맥스 스틸', 'IMAX scale still'],
	['아나모픽 플레어', 'anamorphic lens flare'],
	['테크니컬러 뮤지컬', 'Technicolor musical still'],
	['느와르 블라인드', 'noir venetian blind shadows'],
	['무성영화 자막판', 'silent film intertitle'],
	['우키요에 번개', 'ukiyo-e thunder god homage'],
	['명청자 문양', 'blue and white porcelain motif'],
	['페르시아 미니어처', 'Persian miniature painting'],
	['비잔틴 성화', 'Byzantine icon style'],
	['대성당 스테인드', 'cathedral stained glass'],
	['벽화 동굴화', 'cave painting mural'],
	['암각문', 'petroglyph carving'],
	['타투 플래시 시트', 'tattoo flash sheet'],
	['그래피티 스로우업', 'graffiti throw-up'],
	['칠판 메뉴판', 'chalkboard menu lettering'],
	['네온 벤토 UI', 'neon bento UI mockup'],
	['플랫레이 놀링', 'flat lay knolling'],
];

function genExecutions() {
	return execPairs.map(([ko, en]) => ({
		ko: `${ko} 느낌으로`,
		en: `${en}, stylized execution`,
	}));
}

const raw = JSON.parse(fs.readFileSync(target, 'utf8'));

const missions = padTo100(raw.missions.slice(0, SEED_LEN.missions), genMissions, 'missions');
const emotions = padTo100(raw.emotions.slice(0, SEED_LEN.emotions), genEmotions, 'emotions');
const constraints = padTo100(raw.constraints.slice(0, SEED_LEN.constraints), genConstraints, 'constraints');
const executions = padTo100(raw.executions.slice(0, SEED_LEN.executions), genExecutions, 'executions');

const out = { missions, emotions, constraints, executions };
fs.writeFileSync(target, JSON.stringify(out, null, '\t') + '\n', 'utf8');
console.log('Wrote', target, {
	missions: missions.length,
	emotions: emotions.length,
	constraints: constraints.length,
	executions: executions.length,
});
