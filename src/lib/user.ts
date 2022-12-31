import {
	collection,
	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';
import {
	firestore,
	getConverter,
	serverTimestamp,
} from '@/lib/firebase';
import type { UserDocumentData } from '@/types/user';

/**
 * firestore からuser コレクションの参照を取得する
 */
export const usersRef = () => {
	return collection(
		firestore,
		'users'
	).withConverter(getConverter<UserDocumentData>());
};

/**
 * 指定のid に一致するuser ドキュメントを取得する  
 * 
 * @param uid 
 * @returns 
 */
export const getUser = async (uid: string) => {
	const snapshot = await getDoc(doc(usersRef(), uid));
	const isExist = snapshot.exists();
	const user = snapshot.data();

	return { isExist, user };
};

/**
 * 渡されたユーザー情報をもとに、user ドキュメントを追加する  
 * 
 * @param uid 追加するユーザー情報のuid  
 * @param displayName ユーザーの表示名  
 * @param photoUrl アイコン画像のURL  
 */
export const addUser = async ({
	uid,
	displayName,
	photoUrl
}: {
	uid: string,
	displayName: string | null,
	photoUrl: string | null
}) => {
	const user = {
		name: displayName,
		photoUrl,
		createdAt: serverTimestamp(),
	};
	await setDoc(doc(usersRef(), uid), user);
};
