import { AuthProvider } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import {
	render,
	cleanup,
	screen,
	waitFor,
} from '@testing-library/react';
import type { User } from 'firebase/auth';

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
	});

	it('AuthContext からデータが取得できる', () => {
		const expectedUserName = 'test user'
		useAuthStateMock.mockReturnValue([
			{ uid: 'test-user-id', displayName: expectedUserName } as User,
			true,
			undefined
		]);

		render(<TestComponent />);

		waitFor(() => {
			expect(
				screen.getByText(`${expectedUserName} でログインできました`)
			).toBeTruthy();
		});
	});
});

