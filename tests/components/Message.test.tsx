import {
	render,
	cleanup,
	screen,
	waitFor,
} from '@testing-library/react';
import {
	userFactory
} from '@/../tests/factories/user';
import {
	messageFactory
} from '@/../tests/factories/message';
import { Timestamp } from 'firebase/firestore';

const sender = userFactory.build({
	id: 'user-id',
	name: 'test user',
	photoUrl: 'user-photo-url',
});

// usersContext の動作テストは別のテストファイルで行うため、
// ここではモックを使って返り値を得る
let useUsersValue = {
	usersById: { 'user-id': sender }, loading: true
};
vi.mock('@/contexts/UsersContext', () => {
	return {
		useUsers: () => useUsersValue
	};
});

// 添付画像の表示動作をモックする
const useBlobMock = vi.fn();
vi.mock('@/hooks/useBlob', () => {
	return {
		useBlob: useBlobMock,
	};
});

describe('Message', async () => {
	const { Message } = await import('@/components/Message');

	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	describe('画像なしの場合', () => {
		const message = messageFactory.build({
			content: 'test message content',
			senderId: 'user-id',
			imagePath: null,
			createdAt: Timestamp.fromDate(new Date('2022-07-01 00:00:00+09:00')),
		});

		beforeEach(() => {
			useBlobMock.mockReturnValue({});
		});

		it('読み込み中はloading メッセージが表示される', () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: true
			};
			render(<Message message={message} />);

			expect(screen.getByText('loading...')).toBeInTheDocument();
		});

		it('メッセージを送信したユーザーのアイコン画像が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByRole('img').getAttribute('src')).toBe('user-photo-url')
			);
		});

		it('メッセージを送信したユーザーの名前が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('test user')).toBeInTheDocument()
			);
		});

		it('メッセージを送信した時間が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('2022-07-01 00:00')).toBeInTheDocument()
			);
		});

		it('メッセージの内容が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('test message content')).toBeInTheDocument()
			);
		});
	});

	describe('画像ありの場合', () => {
		const message = messageFactory.build({
			content: 'test message content',
			senderId: 'user-id',
			imagePath: 'image-storage-path',
			createdAt: Timestamp.fromDate(new Date('2022-07-01 00:00:00+09:00')),
		});

		beforeEach(() => {
			useBlobMock.mockReturnValue({ url: 'message-image-url' });
		});

		it('読み込み中はloading メッセージが表示される', () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: true
			};
			render(<Message message={message} />);

			expect(screen.getByText('loading...')).toBeInTheDocument();
		});

		it('メッセージを送信したユーザーのアイコン画像が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByAltText('user-icon').getAttribute('src')).toBe('user-photo-url')
			);
		});

		it('メッセージを送信したユーザーの名前が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('test user')).toBeInTheDocument()
			);
		});

		it('メッセージを送信した時間が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('2022-07-01 00:00')).toBeInTheDocument()
			);
		});

		it('メッセージの内容が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};
			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByText('test message content')).toBeInTheDocument()
			);
		});

		it('メッセージに添付した画像が表示されている', async () => {
			useUsersValue = {
				usersById: { 'user-id': sender }, loading: false
			};

			render(<Message message={message} />);

			await waitFor(() =>
				expect(screen.getByAltText('message-image')).toHaveAttribute('src', 'message-image-url')
			);
		});
	});
});
