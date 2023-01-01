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
vi.mock('@/context/UsersContext', () => {
	return {
		useUsers: { usersById: { 'user-id': [sender] } },
	}
});

describe('Message', async () => {
	const { Message } = await import('@/components/Message');

	afterEach(() => cleanup());

	vi.mock('@/context/UserContext', () => {
		return {
			useUsers: { usersById: { 'user-id': [sender] } },
		};
	});

	const message = messageFactory.build({
		content: 'test message content',
		senderId: 'user-id',
		createdAt: Timestamp.fromDate(new Date('2022-07-01 00:00:00+09:00')),
	});

	it('読み込み中はloading メッセージが表示される', () => {
		render(<Message message={message} />);

		expect(screen.getByText('loading...')).toBeInTheDocument();
	});

	it('メッセージを送信したユーザーのアイコン画像が表示されている', () => {
		render(<Message message={message} />);

		waitFor(() =>
			expect(screen.getByRole('img').getAttribute('src')).toBe('user-photo-url')
		);
	});

	it('メッセージを送信したユーザーの名前が表示されている', () => {
		render(<Message message={message} />);

		waitFor(() =>
			expect(screen.getByText('test user')).toBeInTheDocument()
		);
	});

	it('メッセージを送信した時間が表示されている', () => {
		render(<Message message={message} />)

		waitFor(() =>
			expect(screen.getByText('2022-07-01 00:00')).toBeInTheDocument()
		);
	});

	it('メッセージの内容が表示されている', () => {
		render(<Message message={message} />)

		waitFor(() =>
			expect(screen.getByText('test message content')).toBeInTheDocument()
		);
	});
});
