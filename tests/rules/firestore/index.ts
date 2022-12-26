import { initializeTestEnvironment, getTestEnv } from "./utils";

// 自動テスト中に起動させるエミュレータのポートの割り当て
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8880';

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
});
