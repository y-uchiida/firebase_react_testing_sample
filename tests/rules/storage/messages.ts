// @vitest-environment node
import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
	ref,
	uploadBytes,
	getBytes,
} from 'firebase/storage';
import { readFileSync, } from 'fs';
import { getTestEnv } from '@/../tests/utils';
import { userFactory } from '@/../tests/factories/user';
import { FirebaseStorage } from 'firebase/storage';

const user = userFactory.build({ id: 'user-uid' });
const other = userFactory.build({ id: 'other-uid' });
const file = readFileSync('./tests/assets/sample.png');
const userFilePath = 'messages/user-message-id/sample.png';
const otherFilePath = 'messages/other-message-id/sample.png';

export const messagesTest = () => {
	describe('messages', () => {
		let env: RulesTestEnvironment;

		beforeEach(async () => {
			env = getTestEnv();
			await env.withSecurityRulesDisabled(async (context) => {
				const storage = context.storage();
				const userFileRef = ref(storage, userFilePath);
				const otherFileRef = ref(storage, otherFilePath);

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
			let storage: FirebaseStorage;

			beforeEach(() => {
				storage = env.unauthenticatedContext().storage();
			});

			it('未認証の場合は添付ファイルを読み込みできない', async () => {
				const storageRef = ref(storage, otherFilePath);
				await assertFails(getBytes(storageRef));
			});

			it('未認証の場合は添付ファイルをアップロードできない', async () => {
				const newStorageRef = ref(
					storage,
					'messages/new-message-id/sample.png'
				);
				await assertFails(uploadBytes(
					newStorageRef,
					file, {
					customMetadata: { ownerId: other.id }
				}));
			});
		});

		describe('認証済みの場合', () => {
			let storage: FirebaseStorage;

			describe('認証ユーザー自身のメッセージに対する操作', () => {
				beforeEach(() => {
					storage = env.authenticatedContext(user.id).storage();
				});

				it('認証ユーザー自身が送信したメッセージに添付されたファイルを読み込みできる', async () => {
					const storageRef = ref(storage, userFilePath);
					await assertSucceeds(getBytes(storageRef));
				});
				it('認証ユーザー自身が送信したメッセージに対して、添付ファイルをアップロードできる', async () => {
					const newStorageRef = ref(storage, '/messages/new-message-id/sample.png');
					await assertSucceeds(uploadBytes(
						newStorageRef,
						file,
						{ customMetadata: { ownerId: user.id } }
					));
				});

				it('認証ユーザー自身が送信したメッセージに対して、添付ファイルを更新できる', async () => {
					const storageRef = ref(storage, userFilePath);
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
					const storageRef = ref(storage, otherFilePath);
					await assertSucceeds(getBytes(storageRef));
				});

				it('認証ユーザー以外が送信したメッセージに対して、添付ファイルをアップロードできない', async () => {
					const newStorageRef = ref(storage, 'messages/new-message-id/sample.png');
					await assertFails(uploadBytes(
						newStorageRef,
						file,
						{ customMetadata: { ownerId: other.id } }
					));
				});

				it('認証ユーザー以外が送信したメッセージに添付されたファイルを更新できない', async () => {
					const storageRef = ref(storage, otherFilePath);
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
