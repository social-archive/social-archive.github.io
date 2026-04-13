import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const IMAGE_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif', '.svg']);

function getGalleryDir(): string {
	const fromCwd = path.resolve(process.cwd(), 'public', 'images', 'gallery');
	const fromThisFile = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		'..',
		'..',
		'public',
		'images',
		'gallery',
	);
	if (existsSync(fromCwd)) return fromCwd;
	if (existsSync(fromThisFile)) return fromThisFile;
	return fromCwd;
}

export type GalleryImageEntry = {
	/** 사이트 루트 기준 URL (`public/` → `/`) */
	image: string;
	/** 파일명(확장자 제외) 기반 표시 제목 */
	title: string;
	/** 식별용 파일명 */
	filename: string;
	/** 최신순 정렬용 날짜 */
	lastModified?: Date;
};

function galleryPublicUrl(filename: string): string {
	const safe = filename.split('/').map((p) => encodeURIComponent(p)).join('/');
	return `/images/gallery/${safe}`;
}

/**
 * `public/images/gallery`에 있는 이미지 파일을 읽어 목록을 만듭니다.
 * `astro dev`에서도 매 요청(또는 HMR 후) 시점의 디스크를 읽으므로, 빌드 없이 파일만 넣고 새로고침하면 반영됩니다.
 * 프로덕션 정적 배포 시에는 `astro build` 한 번에 목록이 HTML에 박힙니다.
 */
export async function getGalleryImages(): Promise<GalleryImageEntry[]> {
	const galleryDir = getGalleryDir();
	let names: string[];
	try {
		names = await fs.readdir(galleryDir);
	} catch {
		return [];
	}

	const items: GalleryImageEntry[] = [];

	for (const name of names) {
		const ext = path.extname(name).toLowerCase();
		if (!IMAGE_EXT.has(ext)) continue;

		const fullPath = path.join(galleryDir, name);
		let st;
		try {
			st = await fs.stat(fullPath);
		} catch {
			continue;
		}
		if (!st.isFile()) continue;

		const base = path.basename(name, ext);
		const title = base.replace(/[_-]+/g, ' ').trim() || name;

		items.push({
			filename: name,
			image: galleryPublicUrl(name),
			title,
			lastModified: st.mtime,
		});
	}

	items.sort((a, b) => {
		const dateA = a.lastModified?.getTime() ?? 0;
		const dateB = b.lastModified?.getTime() ?? 0;
		return dateB - dateA;
	});

	return items;
}
