/**
 * daily-quest-parts.json 생성 — 각 축 100개 (큐레이션, 격자 자동생성 없음).
 * 실행: node scripts/build-daily-quest-100.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	CURATED_MISSIONS,
	CURATED_EMOTIONS,
	CURATED_CONSTRAINTS,
	buildExecutions,
} from './daily-quest-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const target = path.join(root, 'src', 'data', 'daily-quest-parts.json');

function uniqByKo(items) {
	const seen = new Set();
	return items.filter((x) => {
		const k = x.ko.trim();
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}

function take100(label, items) {
	const u = uniqByKo(items);
	if (u.length < 100) {
		throw new Error(`${label}: need at least 100 unique ko, got ${u.length}`);
	}
	return u.slice(0, 100);
}

const missions = take100('missions', CURATED_MISSIONS);
const emotions = take100('emotions', CURATED_EMOTIONS);
const constraints = take100('constraints', CURATED_CONSTRAINTS);
const executions = take100('executions', buildExecutions());

const out = { missions, emotions, constraints, executions };
fs.writeFileSync(target, JSON.stringify(out, null, '\t') + '\n', 'utf8');
console.log('Wrote', target, {
	missions: missions.length,
	emotions: emotions.length,
	constraints: constraints.length,
	executions: executions.length,
});
