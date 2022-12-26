import { Timestamp } from '@/lib/firebase';

export type MessageDocumentData = {
	createdAt: Timestamp,
	content: string,
	senderId: string
};
