import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import {
	getTestEnv,
	setCollection
} from '@/../tests/rules/firestore/utils';
import { userFactory } from '@/../tests/factories/user';
import { messageFactory } from '@/../tests/factories/message';
import { WithId } from '@/lib/firebase';
import { UserDocumentData } from '@/types/user';
import { MessageDocumentData } from '@/types/message';

// テストケース内で利用する情報
let user: WithId<UserDocumentData>;
let other: WithId<UserDocumentData>;
let users: WithId<UserDocumentData>[];
let userMessage: WithId<MessageDocumentData>;
let otherMessage: WithId<MessageDocumentData>;
let messages: WithId<MessageDocumentData>[];

export const messageTest = () => {
	let env: RulesTestEnvironment;

	// 自動テスト用のfirestore にテストデータをセットする
	beforeEach(async () => {
		user = userFactory.build();
		other = userFactory.build();
		users = [user, other];

		userMessage = messageFactory.build({
			id: 'user-message-id',
			senderId: user.id,
		});
		otherMessage = messageFactory.build({
			id: 'other-message-id',
			senderId: other.id,
		});
		messages = [userMessage, otherMessage];

		env = getTestEnv();
		// セキュリティルールを無視するコンテキストを用いて、テストデータを投入
		await env.withSecurityRulesDisabled(async (context) => {
			const adminDb = context.firestore();
			await setCollection(adminDb.collection('users'), users);
			await setCollection(adminDb.collection('messages'), messages);
		});
	});

	describe('未認証の場合', () => {
		let db: firebase.firestore.Firestore;

		beforeEach(() => {
			// 未認証状態のfirebase インスタンスを取得
			db = env.unauthenticatedContext().firestore();
		});

		it('未認証の場合はmessage ドキュメントを読み込み(get) できない', async () => {
			const ref = db.collection('messages').doc(otherMessage.id);
			await assertFails(ref.get());
		});

		it('未認証の場合はmessage コレクションを読み込み(list) できない', async () => {
			const ref = db.collection('messages');
			await assertFails(ref.get());
		});

		it('未認証の場合はmessage ドキュメントを作成できない', async () => {
			const newMessage = messageFactory.build();
			const ref = db.collection('messages');
			await assertFails(ref.add(newMessage));
		});
		it('未認証の場合はmessage ドキュメントを更新できない', async () => {
			const ref = db.collection('messages').doc(otherMessage.id);
			await assertFails(ref.update({ content: 'updated' }));
		});
		it('未認証の場合はmessage ドキュメントを削除できない', async () => {
			const ref = db.collection('messages').doc(otherMessage.id);
			await assertFails(ref.delete());
		});
	});
}
