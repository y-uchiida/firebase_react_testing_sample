// @vitest-environment node
import {
	initializeTestEnvironment,
	getTestEnv,
} from '@/../tests/utils';
import { messagesTest } from '@/../tests/rules/storage/messages';

describe('storage.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment('demo-storage-rules-test');
	});

	afterAll(async () => {
		await getTestEnv().cleanup();
	});

	afterEach(async () => {
		await getTestEnv().clearStorage();
	});

	/* messages のファイルに対するセキュリティルールのテスト */
	messagesTest();
});
