import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif', '.svg']);

export type GalleryImageEntry = {
	/** URL 경로 (public 기준) */
	image: string;
	/** 파일명(확장자 제외) 기반 표시 제목 */
	title: string;
	/** 정렬·식별용 파일명 */
	filename: string;
};

/**
 * `public/images/gallery`에 넣은 이미지를 빌드 시 스캔합니다.
 * 숨김 파일·`.gitkeep`은 제외합니다.
 */
export function getGalleryImagesFromPublic(): GalleryImageEntry[] {
	const dir = path.join(process.cwd(), 'public', 'images', 'gallery');
	if (!fs.existsSync(dir)) return [];

	const names = fs.readdirSync(dir).filter((name) => {
		if (name.startsWith('.') || name === '.gitkeep') return false;
		return IMAGE_EXT.has(path.extname(name).toLowerCase());
	});

	names.sort((a, b) => b.localeCompare(a, 'ko', { numeric: true }));

	return names.map((filename) => {
		const ext = path.extname(filename);
		const base = path.basename(filename, ext);
		const title = base.replace(/[_-]+/g, ' ').trim() || filename;
		return {
			filename,
			image: `/images/gallery/${filename}`,
			title,
		};
	});
}
