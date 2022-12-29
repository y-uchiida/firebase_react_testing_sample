import { userFactory } from '@/../tests/factories/user';
import { WithId } from '@/lib/firebase';
import { UserDocumentData } from '@/types/user';
import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import { getTestEnv, setCollection } from '../utils';

// テストケース内で利用するユーザー情報
let user: WithId<UserDocumentData>;
let other: WithId<UserDocumentData>;
let users: WithId<UserDocumentData>[];

export const usersTest = () => {
	let env: RulesTestEnvironment;

	// 自動テスト用のfirestoreに、users の情報をセットする
	beforeEach(async () => {
		user = userFactory.build();
		other = userFactory.build();
		users = [user, other];

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

			it('認証ユーザーが自身のuser ドキュメントを追加できる', async () => {
				const newUser = userFactory.build();
				const db = env.authenticatedContext(newUser.id).firestore();
				const ref = db.collection('users');
				await assertSucceeds(ref.doc(newUser.id).set(newUser));
			});

			it('認証ユーザーが自身のuser ドキュメントを更新できる', async () => {
				const db = env.authenticatedContext(user.id).firestore();
				const docRef = db.collection('users').doc(user.id);
				await assertSucceeds(docRef.update({ photoUrl: 'https://example.com/photo.jpg' }));
			});

			it('認証ユーザーが自身のuser ドキュメントを削除できる', async () => {
				const ref = db.collection('users').doc(user.id);
				await assertSucceeds(ref.delete());
			});
		});
	});
};
