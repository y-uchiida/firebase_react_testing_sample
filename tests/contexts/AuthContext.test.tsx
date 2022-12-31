import { AuthProvider } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import {
	render,
	renderHook,
	cleanup,
	screen,
	waitFor,
} from '@testing-library/react';
import {
	// renderHook, // 2022.12.31 時点でrender の警告が出るので、 @testing-library/react のrenderHookを使う
	act as actHook,
	cleanup as cleanupHook,
} from '@testing-library/react-hooks';
import { User } from 'firebase/auth';

/* useAuthState をモックして戻り値をコントロールする
 * @/hooks/useAuthState は、ライブラリの関数を呼び出すだけのhook
 * そのためモック化も容易にできる
 */
const useAuthStateMock = vi.fn();
vi.mock('@/hooks/useAuthState', () => {
	return { useAuthState: useAuthStateMock }
});

describe('AuthProvider', async () => {
	const { useAuth, AuthProvider } = await import('@/contexts/AuthContext');

	/* 認証成功した場合にテキストを表示するテスト用コンポーネント */
	const AuthenticatedScreen = () => {
		const { currentUser } = useAuth();
		console.log(currentUser);
		return <div>{`${currentUser?.displayName} でログインできました`}</div>
	};

	const TestComponent = () => {
		return (
			<AuthProvider>
				<AuthenticatedScreen />
			</AuthProvider>
		);
	}

	afterEach(() => {
		/* モック関数の状態をクリアする */
		vi.resetAllMocks();
		cleanup();
		cleanupHook();
	});

	it('AuthContext からデータが取得できる', () => {
		const expectedUserName = 'test user'
		useAuthStateMock.mockReturnValue([
			{ uid: 'test-user-id', displayName: expectedUserName } as User,
			true,
			undefined
		]);

		render(<TestComponent />);

		waitFor(() =>
			expect(
				screen.getByText(`${expectedUserName} でログインできました`)
			).toBeTruthy()
		);
	});

	it('未認証の場合はログイン画面が表示される', async () => {
		useAuthStateMock.mockReturnValue([null, false, undefined]);

		render(<TestComponent />);

		waitFor(() =>
			expect(screen.getByText('ログインしてください')).toBeTruthy()
		);
	});
});

const getUserMock = vi.fn();
const addUserMock = vi.fn();
vi.mock('@/lib/user', () => {
	return {
		getUser: getUserMock,
		addUser: addUserMock,
	}
});

const signInGoogleWithPopupMock = vi.fn();
const signOutMock = vi.fn();
vi.mock('@/lib/firebase', async () => {
	const firebase = await vi.importActual<Object>('@/lib/firebase');
	return {
		...firebase,
		signInGoogleWithPopup: signInGoogleWithPopupMock,
		signOut: signOutMock
	}
});

describe('useAuth のテスト', async () => {
	const { useAuth } = await import('@/contexts/AuthContext');

	afterEach(async () => {
		vi.resetAllMocks(); // モック関数の状態をクリアする
		await cleanupHook(); // hookの状態をクリアする
	});

	it('初めてのログインの場合、ユーザー情報が登録される', async () => {
		const { result } = renderHook(() => useAuth());
		const testUserData = {
			uid: 'test-uid',
			displayName: 'test user',
			photoURL: null,
		};

		signInGoogleWithPopupMock.mockResolvedValue({
			user: testUserData,
		});
		// 初回ログインの場合はusers コレクションにデータがないので isExist: false が返される
		getUserMock.mockResolvedValue({ isExist: false });

		await actHook(async () => {
			await result.current.signInWithGoogle();
		});

		expect(addUserMock).toBeCalledWith(testUserData);
	});

	it('二回目以降のログインの場合、ユーザー情報は追加されない', async () => {
		const { result } = renderHook(() => useAuth());
		const testUserData = {
			uid: 'test-uid',
			displayName: 'test user',
			photoURL: null,
		};

		signInGoogleWithPopupMock.mockResolvedValue({
			user: testUserData,
		});
		// 2回目以降のログインの場合は isExist: true が返される
		getUserMock.mockResolvedValue({ isExist: true });

		await actHook(async () => {
			await result.current.signInWithGoogle();
		});

		expect(addUserMock).not.toBeCalled();
	});

	it('ログイン処理中にエラーが発生した場合は、認証済みの場合もログアウトされる', async () => {
		const { result } = renderHook(() => useAuth());
		const testUserData = {
			uid: 'test-uid',
			displayName: 'test user',
			photoURL: null,
		};

		signInGoogleWithPopupMock.mockResolvedValue({
			user: testUserData,
		});
		// エラー発生をモックする(mockRejectedValue)
		getUserMock.mockRejectedValue('error');

		await actHook(async () => {
			await result.current.signInWithGoogle();
		});

		expect(signOutMock).toBeCalled();
	});
});
