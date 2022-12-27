import {
	initializeTestEnvironment as _initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import firebase from 'firebase/compat/app';
import { getConverter, WithId } from '@/lib/firebase';
import testEnvSettings from '../../emulator/firebase.json';
import path from "node:path";
import url from "node:url";

/**
 * エミュレータと接続してやり取りするオブジェクトを変数 testEnvに格納し、
 * テストコード内から操作できるようにしておく
 */
let testEnv: RulesTestEnvironment;
export const getTestEnv = () => testEnv;

/* firestore.rules のパス */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const firestoreRulesPath = `${__dirname}/../../emulator/firestore.rules`;

/**
 * テスト設定を読み込みする
 */
export const initializeTestEnvironment = async () => {
	testEnv = await _initializeTestEnvironment({
		// projectId: projectID,
		projectId: testEnvSettings.projectID,
		firestore: {
			// rules: readFileSync('tests/emulator/firestore.rules', 'utf8'),
			rules: readFileSync(firestoreRulesPath, 'utf8'),
			port: testEnvSettings.emulators.firestore.port,
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
		ref.doc(_.id).set(getConverter<T>().toFirestore(_));
	})
);
