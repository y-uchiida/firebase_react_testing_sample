import {
	getFirestore,
	collection,
	query,
	orderBy
} from 'firebase/firestore';
import {
	getConverter
} from '@/lib/firebase';
import { MessageDocumentData } from '@/types/message';

/**
 * messages コレクションのreference を返す  
 * importした時点でcollection() が実行されないよう、関数として定義している  
 * 必要なタイミングで関数を実行して返り値を受け取ること
 */
export const messagesRef = () => {
	return collection(getFirestore(), 'messages').withConverter(
		getConverter<MessageDocumentData>()
	);
}

export const messagesQuery = () =>
	query(messagesRef(), orderBy('createdAt', 'asc'));
