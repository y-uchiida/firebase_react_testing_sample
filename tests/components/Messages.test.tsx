import { render, cleanup, screen } from '@testing-library/react';
import { userFactory } from '../factories/user';
import { messageFactory } from '../factories/message';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Timestamp } from 'firebase/firestore';

const useCollectionDataMock = vi.fn();
vi.mock('@/hooks/useCollectionData', () => {
	console.log('called useCollectionDataMock')
	return {
		useCollectionData: useCollectionDataMock,
	}
});

const useUsersMock = vi.fn();
vi.mock('@/contexts/UsersContext', () => {
	return {
		useUsers: useUsersMock,
	}
});

describe('Messages', async () => {
	const { Messages } = await import('@/components/Messages');

	afterEach(() => {
		vi.resetAllMocks();
		cleanup();
	});

	it('読み込み中の場合、ローディング画面が表示される', async () => {
		useCollectionDataMock.mockReturnValue([[], true, undefined, undefined]);

		render(<Messages />);

		expect(screen.getByText('loading...')).toBeInTheDocument();
	});

	it('読み込み完了後、メッセージ一覧が表示される', async () => {
		const message = messageFactory.build({
			content: 'message1 content',
			senderId: 'test-user-uid',
			createdAt: Timestamp.fromDate(new Date('2022-07-01 00:00:00+09:00')),
		});
		const message2 = messageFactory.build({
			content: 'message2 content',
			senderId: 'test-user-uid',
			createdAt: Timestamp.fromDate(new Date('2022-07-01 00:00:00+09:00')),
		});

		useCollectionDataMock.mockReturnValue([
			[message, message2],
			false,
			undefined,
			undefined
		]);

		const user = userFactory.build({
			id: 'test-user-uid',
			name: 'user name',
		});
		useUsersMock.mockReturnValue({
			users: user,
			usersById: {
				[user.id]: user
			},
			loading: false
		});

		render(<Messages />);

		expect(screen.getByText('message1 content')).toBeInTheDocument();
		expect(screen.getByText('message2 content')).toBeInTheDocument();
	});
});
