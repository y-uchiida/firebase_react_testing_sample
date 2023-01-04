import {
	initializeTestEnvironment,
	getTestEnv
} from '@/../tests/utils';
import {
	messagesTest
} from '@/../tests/queries/firestore/collections/messages';
import firebaseTestingEmulatorSettings from '../../emulator/firebase.json';

// 自動テスト用のfirestore エミュレータホスト
process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${firebaseTestingEmulatorSettings.emulators.firestore.port}`;

describe('firestore.rules', () => {
	// 自動テスト用の環境を起動する
	beforeAll(async () => {
		// await initializeTestEnvironment('testable-firebase-sample-chat-queries-test');
		await initializeTestEnvironment();
	});

	// すべてのテストが完了したら、テスト用の環境を終了する
	afterAll(async () => {
		await getTestEnv().cleanup()
	});

	// テストケース終了ごとに、firestore を空にする
	afterEach(async () => {
		await getTestEnv().clearFirestore();
	});

	// messages コレクションのクエリのテスト
	messagesTest();
});
