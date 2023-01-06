import {
	getFirestore,
	collection,
	doc,
	getDoc,
	setDoc
} from 'firebase/firestore';
import { getConverter, serverTimestamp } from '@/lib/firebase';
import type { UserSecretDocumentData } from '@/types/userSecrets';
import { stringLength } from '@firebase/util';

export const userSecretsRef = () => collection(
	getFirestore(),
	'userSecrets'
).withConverter(getConverter<UserSecretDocumentData>());

/**
 * userSecret を追加する
 * @param uid ログイン中のユーザーのuid
 * @param userSecret のトークン(fcmToken)を含んだオブジェクト
 */
export const setUserSecret = async (
	uid: string,
	{ fcmToken }: { fcmToken: string }
) => {
	const userSecret = {
		fcmToken,
		createdAt: serverTimestamp()
	};
	await setDoc(
		doc(
			userSecretsRef(),
			uid
		),
		userSecret,
		{ merge: true }
	);
};
