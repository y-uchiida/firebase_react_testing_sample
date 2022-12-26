// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

/* firebase SDK と Admin SDK の Timestamp 型の差分を消す
 */
import { Timestamp } from "firebase/firestore";

export { Timestamp };

/* .env で設定したfirebase の設定を読み込む */
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* 設定したコンフィグのオブジェクトを読み込んで、firebaseを初期化する */
export const app = initializeApp(firebaseConfig);
