import { firebaseConfig, IS_EMULATED, IS_TESTING } from "@/config/env";

import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import {
	User,
	connectAuthEmulator,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut as _signOut
} from 'firebase/auth';
import firebaseEmulatorSettings from '../../firebase.json';
import firebaseTestingEmulatorSettings from '../../firebase.json';

import { omit, merge } from 'lodash-es';
import {
	DocumentData,
	SnapshotOptions,
	FirestoreDataConverter,
	PartialWithFieldValue,
	getFirestore,
	connectFirestoreEmulator,
} from 'firebase/firestore';


/* firebase SDK と Admin SDK の Timestamp 型の差分を消す
 */
export { Timestamp } from 'firebase/firestore';

/* 設定したコンフィグのオブジェクトを読み込んで、firebaseを初期化する */
const app = initializeApp(firebaseConfig);

/* 初期化後、機能別にモジュール化されたオブジェクトをエクスポートする */
const firestore = getFirestore(app);
// const storage = getStorage(app);
// const functions = getFunctions(app);
const auth = getAuth(app);
// const googleAuthProvider = new GoogleAuthProvider();

/* エミュレータ上で動作している場合は、接続先をエミュレータに切り替える */
const isEmulating = IS_EMULATED;
const isTesting = IS_TESTING;
if (isEmulating) {
	const { emulators } = isTesting ? firebaseTestingEmulatorSettings : firebaseEmulatorSettings;
	connectFirestoreEmulator(firestore, 'localhost', emulators.firestore.port);
	// connectStorageEmulator(storage, 'localhost', emulators.storage.port);
	// connectFunctionsEmulator(functions, 'localhost', emulators.functions.port);
	connectAuthEmulator(auth, `http://localhost:${emulators.auth.port}/`);
}

// export { firebaseConfig, app, auth, storage, functions, googleAuthProvider };
export { app, firestore, auth, /*storage,*/ /*functions,*/ /*googleAuthProvider*/ };

/* firestore から取得したものは、data() と id別々のプロパティになるので、
 * data() の中にid が含まれるようにする
 */
export type WithId<T> = { id: string } & T;

/**
 * firestore に保存されているドキュメントと、Idのプロパティをまとめて扱うための処理  
 * 型の相互関係の都合で、lodash を利用している  
 * @returns firestore のドキュメントデータにidを追加したオブジェクト
 */
export const getConverter = <T>(): FirestoreDataConverter<WithId<T>> => ({
	toFirestore: (
		data: PartialWithFieldValue<WithId<T>>
	): DocumentData => {
		return omit(data, ['id']);
	},
	fromFirestore: (
		snapshot,
		options: SnapshotOptions
	): WithId<T> => {
		return merge(snapshot.data(options) as T, { id: snapshot.id });
	},
});

export const signInGoogleWithPopup = async () => {
	const provider = new GoogleAuthProvider();

	return signInWithPopup(auth, provider);
};

export const signOut = async () => _signOut(auth);
