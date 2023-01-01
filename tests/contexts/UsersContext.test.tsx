import {
	renderHook
} from '@testing-library/react';
import {
	useUsers,
	UsersProvider
} from '@/contexts/UsersContext';
import { ReactNode } from 'react';

describe('useUsers', () => {
	const wrapper = ({ children }: { children: ReactNode }) => {
		return <UsersProvider>{children}</UsersProvider>
	}

	// firestore から取得するデータのモック
	vi.mock('@/hooks/useCollectionData', () => {
		return {
			useCollectionData: () => [
				[{ id: 'test-user-uid', name: 'test user' }],
				false,
			]
		}
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('useUsers から、usersById, loading を取得できる', () => {
		// useUsers は UsersProvider の子コンポーネントでしか使えないので、
		// wrapper を挟んで renderHook を実行させる
		const { result } = renderHook(() => useUsers(), { wrapper });

		expect(result.current).toEqual({
			users: [{ id: 'test-user-uid', name: 'test user' }],
			usersById: {
				'test-user-uid': {
					id: 'test-user-uid',
					name: 'test user',
				}
			},
			loading: false,
		});
	});
});
