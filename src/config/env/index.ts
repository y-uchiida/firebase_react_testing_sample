/* 環境変数の読み込みとエクスポート */
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
export const FIREBASE_DATABASE = import.meta.env.VITE_FIREBASE_DATABASE;
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
export const FIREBASE_SENDER_ID = import.meta.env.VITE_FIREBASE_SENDER_ID;
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
export const FIREBASE_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

/* .env で設定したfirebase の設定を読み込む */
export const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DATABASE,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MEASUREMENT_ID,
};

/* ローカル環境で、エミュレータを利用して動作しているかを判定する */
export const IS_EMULATED = import.meta.env.VITE_IS_EMULATED;

/* 自動テスト用の環境の場合 */
export const IS_TESTING = import.meta.env.VITE_IS_TESTING;
