import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import path from 'node:path';

const IMAGE_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif', '.svg']);

export type GalleryImageEntry = {
	/** URL 경로 (R2 퍼블릭 도메인 기준) */
	image: string;
	/** 파일명(확장자 제외) 기반 표시 제목 */
	title: string;
	/** 식별용 파일명 */
	filename: string;
	/** 최신순 정렬용 날짜 */
	lastModified?: Date;
};

// GitHub Actions 및 로컬 환경 변수로부터 설정 읽기
const R2_ENDPOINT = import.meta.env.R2_ENDPOINT;
const PUBLIC_DOMAIN = import.meta.env.R2_PUBLIC_URL || "https://pub-aa6072d0eb7442a2bd9fc962ce3e9258.r2.dev";
const BUCKET_NAME = import.meta.env.R2_BUCKET_NAME || "sarc";

/**
 * Cloudflare R2 스토리지에서 직접 파일 목록을 읽어옵니다. (S3 SDK 인증 방식)
 */
export async function getGalleryImages(): Promise<GalleryImageEntry[]> {
	const accessKeyId = import.meta.env.R2_ACCESS_KEY_ID;
	const secretAccessKey = import.meta.env.R2_SECRET_ACCESS_KEY;

	// 인증 키가 없는 경우 빈 목록 반환 (로컬 빌드 시나 환경 변수 미설정 시 대응)
	if (!accessKeyId || !secretAccessKey || !R2_ENDPOINT) {
		console.warn('R2 credentials or endpoint not found. Skipping gallery fetch.');
		return [];
	}

	const s3Client = new S3Client({
		region: 'auto',
		endpoint: R2_ENDPOINT,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	try {
		const command = new ListObjectsV2Command({
			Bucket: BUCKET_NAME,
			Prefix: 'gallery/',
		});

		const response = await s3Client.send(command);
		const contents = response.Contents || [];

		const items = contents
			.filter((obj) => {
				const key = obj.Key || '';
				if (key === 'gallery/') return false;
				return IMAGE_EXT.has(path.extname(key).toLowerCase());
			})
			.map((obj) => {
				const key = obj.Key || '';
				const filename = key.replace('gallery/', '');
				const ext = path.extname(filename);
				const base = path.basename(filename, ext);
				const title = base.replace(/[_-]+/g, ' ').trim() || filename;

				return {
					filename,
					image: `${PUBLIC_DOMAIN}/gallery/${filename}`,
					title,
					lastModified: obj.LastModified,
				};
			});

		/** 최신 업로드 순 정렬 */
		items.sort((a, b) => {
			const dateA = a.lastModified?.getTime() || 0;
			const dateB = b.lastModified?.getTime() || 0;
			return dateB - dateA;
		});

		return items;
	} catch (error) {
		console.error('Error fetching gallery list from R2:', error);
		return [];
	}
}
