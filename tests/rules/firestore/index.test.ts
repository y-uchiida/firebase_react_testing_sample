import { usersTest } from "./collections/user";
import { initializeTestEnvironment, getTestEnv } from "@/../tests/utils";
import firebaseTestingEmulatorSettings from '../../emulator/firebase.json';
import { messageTest } from "./collections/message";

// 自動テスト用のfirestore エミュレータホスト
process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${firebaseTestingEmulatorSettings.emulators.firestore.port}`;

describe('firestore.rules', () => {
	// 自動テスト用の環境を起動する
	beforeAll(async () => {
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

	// 以降、コレクションごとにテストケースをインポートする
	usersTest();
	messageTest();
});
