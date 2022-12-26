import {
	initializeTestEnvironment as _initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import firebase from 'firebase/compat/app';
import { getConverter, WithId } from '@/lib/firebase';

/**
 * エミュレータと接続してやり取りするオブジェクトを変数 testEnvに格納し、
 * テストコード内から操作できるようにしておく
 */
let testEnv: RulesTestEnvironment;
export const getTestEnv = () => testEnv;


/**
 * テスト設定を読み込みする
 */
export const initializeTestEnvironment = async () => {
	testEnv = await _initializeTestEnvironment({
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		firestore: {
			rules: readFileSync('firestore.rules', 'utf-8'),
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
