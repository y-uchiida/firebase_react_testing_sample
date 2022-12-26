import { Timestamp } from '@/lib/firebase';

export type UserDocumentData = {
	createdAt: Timestamp,
	name: string | null,
	photoUrl: string | null
};
