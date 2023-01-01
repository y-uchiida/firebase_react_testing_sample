import {
	initializeTestEnvironment,
	getTestEnv,
} from '@/../tests/utils'; // utils.ts は tests/rules にある
import {
	messagesTest
} from '@/../tests/queries/firestore/collections/messages';

describe('firestore.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment('testable-firebase-sample-chat-queries-test');
	});
	afterAll(async () => {
		await getTestEnv().cleanup();
	});
	afterEach(async () => {
		await getTestEnv().clearFirestore();
	});

	// messages コレクションのクエリのテスト
	messagesTest();
});
