import {
	getFirestore,
	collection,
	query,
	orderBy,
	Firestore
} from 'firebase/firestore';
import {
	app,
	firestore,
	getConverter
} from '@/lib/firebase';
import { MessageDocumentData } from '@/types/message';

/**
 * messages コレクションのreference を返す  
 * importした時点でcollection() が実行されないよう、関数として定義している  
 * 必要なタイミングで関数を実行して返り値を受け取ること
 */
export const messagesRef = () => {
	const collectionRef = collection(firestore, 'messages').withConverter(
		getConverter<MessageDocumentData>()
	);
	return collectionRef;
}

export const messagesQuery = () =>
	query(messagesRef(), orderBy('createdAt', 'asc'));
