import {
	initializeTestEnvironment as _initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import firebase from 'firebase/compat/app';
import { getConverter, WithId } from '@/lib/firebase';
import testEnvSettings from './emulator/firebase.json';
import path from "node:path";
import url from "node:url";

/**
 * エミュレータと接続してやり取りするオブジェクトを変数 testEnvに格納し、
 * テストコード内から操作できるようにしておく
 */
let testEnv: RulesTestEnvironment;
export const getTestEnv = () => testEnv;

/* rules ファイルのパスを絶対パス形式で変数に格納 */
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const firestoreRulesPath = `${__dirname}/emulator/firestore.rules`;
const storageRulesPath = `${__dirname}/emulator/storage.rules`

/**
 * テスト設定を読み込みする
 */
export const initializeTestEnvironment = async (
	projectId: string = testEnvSettings.projectID
) => {
	testEnv = await _initializeTestEnvironment({
		projectId,
		firestore: {
			rules: readFileSync(firestoreRulesPath, 'utf8'),
			port: testEnvSettings.emulators.firestore.port,
			host: '127.0.0.1'
		},
		storage: {
			rules: readFileSync(storageRulesPath, 'utf8'),
			port: testEnvSettings.emulators.storage.port,
			host: '127.0.0.1'
		}
	});
}

/**
 * テストデータとなるドキュメントを、コレクションにまとめて投入する  
 * 
 * @param ref 
 * @param instances 
 * @returns 
 */
export const setCollection = <T>(
	ref: firebase.firestore.CollectionReference,
	instances: WithId<T>[]
) => Promise.all(
	instances.map((_) => {
		return ref.doc(_.id).set(getConverter<T>().toFirestore(_));
	})
);
