// @vitest-environment node
import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
	uploadBytes,
	getBytes,
} from 'firebase/storage';
import { readFileSync, } from 'fs';
import { getTestEnv } from '@/../tests/utils';
import { userFactory } from '@/../tests/factories/user';
import { FirebaseStorage } from 'firebase/storage';
import firebase from 'firebase/compat/app';

const user = userFactory.build({ id: 'user-uid' });
const other = userFactory.build({ id: 'other-uid' });
const file = readFileSync('./tests/assets/sample.jpg');
const userFilePath = 'messages/user-message-id/sample.jpg';
const otherFilePath = 'messages/other-message-id/sample.jpg';

export const messagesTest = () => {
	describe('messages', () => {
		let env: RulesTestEnvironment;

		beforeEach(async () => {
			env = getTestEnv();
			await env.withSecurityRulesDisabled(async (context) => {
				const storage = context.storage();

				const userFileRef = storage.ref(userFilePath);
				const otherFileRef = storage.ref(otherFilePath);

				/* user の所有ファイルと、otherの所有ファイルをそれぞれアップロードする */
				await uploadBytes(userFileRef, file, {
					customMetadata: { ownerId: user.id }
				});
				await uploadBytes(otherFileRef, file, {
					customMetadata: { ownerId: other.id }
				})
			})
		});


		describe('未認証の場合', () => {
			let storage: firebase.storage.Storage;

			beforeEach(() => {
				storage = env.unauthenticatedContext().storage();
			});

			it('未認証の場合は添付ファイルを読み込みできない', async () => {
				const storageRef = storage.ref(otherFilePath);
				await assertFails(getBytes(storageRef));
			});

			it('未認証の場合は添付ファイルをアップロードできない', async () => {
				const newStorageRef = storage.ref(
					'messages/new-message-id/sample.jpg'
				);
				await assertFails(uploadBytes(
					newStorageRef,
					file, {
					customMetadata: { ownerId: other.id }
				}));
			});
		});

		describe('認証済みの場合', () => {
			let storage: firebase.storage.Storage;

			describe('認証ユーザー自身のメッセージに対する操作', () => {
				beforeEach(() => {
					storage = env.authenticatedContext(user.id).storage();
				});

				it('認証ユーザー自身が送信したメッセージに添付されたファイルを読み込みできる', async () => {
					const storageRef = storage.ref(userFilePath);
					await assertSucceeds(getBytes(storageRef));
				});

				it.skip('認証ユーザー自身が送信したメッセージに対して、添付ファイルをアップロードできる', async () => {
					const newStorageRef = storage.ref('messages/new-message-id/sample.jpg');
					await assertSucceeds(uploadBytes(
						newStorageRef,
						file,
						{ customMetadata: { ownerId: user.id } }
					));
				});

				it('認証ユーザー自身が送信したメッセージに対して、添付ファイルを更新できる', async () => {
					const storageRef = storage.ref(userFilePath);
					await assertSucceeds(uploadBytes(
						storageRef,
						file,
						{ customMetadata: { ownerId: user.id } }
					));
				})
			});
			describe('認証ユーザー以外のメッセージに対する操作', () => {
				beforeEach(() => {
					storage = env.authenticatedContext(user.id).storage();
				});

				it('認証ユーザー以外が送信したメッセージに添付されたファイルを読み込みできる', async () => {
					const storageRef = storage.ref(otherFilePath);
					await assertSucceeds(getBytes(storageRef));
				});

				it('認証ユーザー以外が送信したメッセージに対して、添付ファイルをアップロードできない', async () => {
					const newStorageRef = storage.ref('messages/new-message-id/sample.jpg');
					await assertFails(uploadBytes(
						newStorageRef,
						file,
						{ customMetadata: { ownerId: other.id } }
					));
				});

				it('認証ユーザー以外が送信したメッセージに添付されたファイルを更新できない', async () => {
					const storageRef = storage.ref(otherFilePath);
					await assertFails(uploadBytes(
						storageRef,
						file,
						{ customMetadata: { ownerId: other.id } }
					));
				});

			});
		});
	});
};
