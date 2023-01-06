import {
	getFirestore,
	collection,
	query,
	orderBy,
	Firestore,
	DocumentReference,
	addDoc,
	doc,
	setDoc
} from 'firebase/firestore';
import {
	app,
	firestore,
	getConverter,
	serverTimestamp
} from '@/lib/firebase';
import { MessageDocumentData } from '@/types/message';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export const collectionName = 'messages';

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

export const setMessage = async (ref: DocumentReference, message: MessageDocumentData) => {
	return setDoc(ref, message, { merge: true });
};

export const addMessage = async (content: string, image: File | null, uid: string) => {
	const messageRef = doc(messagesRef());
	const snapshot = image && (await uploadMessageImage(messageRef.id, uid, image));
	const { ref: storageRef } = snapshot || {};

	return setMessage(messageRef, {
		content,
		imagePath: storageRef?.fullPath || null,
		senderId: uid,
		createdAt: serverTimestamp(),
	});
};

export const uploadMessageImage = async (messageId: string, ownerId: string, file: File) => {
	const storageRef = ref(getStorage(), `${collectionName}/${messageId}/${file.name}`);
	const metadata = { customMetadata: { ownerId } };

	return uploadBytes(storageRef, file, metadata);
};
