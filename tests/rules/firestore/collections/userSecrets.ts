import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import {
	getTestEnv,
	setCollection
} from '@/../tests/utils';
import { userSecretFactory } from '@/../tests/factories/userSecret';
import { async } from '@firebase/util';

const userSecret = userSecretFactory.build({ id: 'user-id' });
const otherSecret = userSecretFactory.build({ id: 'other-id' });
const userSecrets = [userSecret, otherSecret];

export const userSecretsTest = () => {
	describe('userSecrets', () => {
		let env: RulesTestEnvironment;

		beforeEach(async () => {
			env = getTestEnv();
			await env.withSecurityRulesDisabled(async (context) => {
				const adminDb = context.firestore();

				await setCollection(
					adminDb.collection('userSecrets'),
					userSecrets
				);
			});
		});

		describe('未認証の場合', () => {
			let db: firebase.firestore.Firestore;

			beforeEach(() => {
				db = env.unauthenticatedContext().firestore();
			});

			it('userSecrets ドキュメントを読み込みできない(get)', async () => {
				const ref = db.collection('userSecrets').doc(otherSecret.id);
				await assertFails(ref.get());
			});

			it('userSecrets コレクションを読み込みできない(list)', async () => {
				const ref = db.collection('userSecrets');
				await assertFails(ref.get());
			});

			it('userSecret ドキュメントを作成できない', async () => {
				const newUserSecret = userSecretFactory.build();
				const ref = db.collection('userSecrets');
				await assertFails(ref.add(newUserSecret));
			});

			it('userSecret ドキュメントを更新できない', async () => {
				const ref = db.collection('userSecrets').doc(otherSecret.id);
				await assertFails(ref.update({ fcmToken: 'updatedToken' }));
			});

			it('userSecret ドキュメントを削除できない', async () => {
				const ref = db.collection('userSecrets').doc(otherSecret.id);
				await assertFails(ref.delete());
			})
		});

		describe('認証済みの場合', () => {
			it('userSecrets コレクションを読み込みできない(list)', async () => {
				const db = env.authenticatedContext(userSecret.id).firestore();
				const ref = db.collection('userSecrets');
				await assertFails(ref.get());
			});

			describe('認証ユーザー自身のuserSecret ドキュメントに対する操作', () => {
				let db: firebase.firestore.Firestore;

				beforeEach(() => {
					db = env.authenticatedContext(userSecret.id).firestore();
				});

				it('認証ユーザー自身のuserSecret ドキュメントは読み込みできる(get)', async () => {
					const ref = db.collection('userSecrets').doc(userSecret.id);
					await assertSucceeds(ref.get());
				});

				it('認証ユーザー自身のuserSecret ドキュメントを作成できる', async () => {
					const newUserSecret = userSecretFactory.build({
						id: 'new-user-id'
					});
					const db = env.authenticatedContext(newUserSecret.id).firestore();
					const ref = db.collection('userSecrets');
					await assertSucceeds(ref.doc(newUserSecret.id).set(newUserSecret));
				});

				it('認証ユーザー自身のuserSecret ドキュメントは更新できる', async () => {
					const ref = db.collection('userSecrets').doc(userSecret.id);
					await assertSucceeds(ref.update({ fcmToken: 'updatedToken' }));
				});

				it('認証ユーザー自身のuserSecret ドキュメントは削除できる', async () => {
					const ref = db.collection('userSecrets').doc(userSecret.id);
					await assertSucceeds(ref.delete());
				});
			});

			describe('認証ユーザー以外のuserSecret ドキュメントに対する操作', () => {
				let db: firebase.firestore.Firestore;

				beforeEach(() => {
					db = env.authenticatedContext(userSecret.id).firestore();
				});

				it('認証ユーザー以外のuserSecret ドキュメントは読み込みできない(get)', async () => {
					const ref = db.collection('usrSecrets').doc(otherSecret.id);
					await assertFails(ref.get());
				});

				it('認証ユーザー以外のuserSecret ドキュメントは作成できない', async () => {
					const newUserSecret = userSecretFactory.build({
						id: 'new-user-id'
					});
					const ref = db.collection('userSecrets');
					await assertFails(ref.doc(newUserSecret.id).set(newUserSecret));
				});

				it('認証ユーザー以外のuserSecret ドキュメントは更新できない', async () => {
					const ref = db.collection('userSecrets').doc(otherSecret.id);
					await assertFails(ref.update({ fcmToken: 'updatedToken' }));
				});

				it('認証ユーザー以外のuserSecret ドキュメントを削除できない', async () => {
					const ref = db.collection('userSecrets').doc(otherSecret.id);
					await assertFails(ref.delete());
				});
			});
		});
	})
};
