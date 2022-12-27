import { userFactory } from '@/../tests/factories/user';
import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import { getTestEnv, setCollection } from '../../utils';

// テストケース内で利用するユーザー情報
const user = userFactory.build({ id: 'user-id' });
const other = userFactory.build({ id: 'other-user' });
const users = [user, other];

export const usersTest = () => {
	let env: RulesTestEnvironment;

	// 自動テスト用のfirestoreに、users の情報をセットする
	beforeEach(async () => {
		env = getTestEnv();
		await env.withSecurityRulesDisabled(async (context) => {
			const adminDb = context.firestore();
			await setCollection(adminDb.collection('users'), users);
		});
	});

	describe('認証済みの場合', () => {
		describe('認証中のユーザーのデータへの操作', () => {
			let db: firebase.firestore.Firestore;

			// 指定のユーザーとして認証した状態のfirestore インスタンスを取得
			beforeEach(() => {
				db = env.authenticatedContext(user.id).firestore();
			});

			it('認証ユーザーのデータを取得できる', async () => {
				// 認証したユーザーのドキュメントの取得を行って、成功するかを検証
				const ref = db.collection('users').doc(user.id);
				await assertSucceeds(ref.get());
			});
		});
	});
};
