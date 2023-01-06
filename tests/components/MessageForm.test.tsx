import {
	render,
	cleanup,
	screen,
	waitFor,
	act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/* addMessage の返り値のモック */
const addMessageMock = vi.fn().mockResolvedValue({});
vi.mock('@/lib/message', () => {
	return {
		addMessage: addMessageMock,
	}
});

/* useAuth の返り値のモック */
vi.mock('@/contexts/AuthContext', () => {
	return {
		useAuth: () => ({ currentUser: { uid: 'test-user-uid' } })
	};
});

describe('MessageForm', async () => {
	const { MessageForm } = await import('@/components/MessagesForm');

	afterEach(() => {
		vi.resetAllMocks();
		cleanup();
	});

	it('メッセージ入力欄が表示される', () => {
		render(<MessageForm />);

		expect(screen.getByLabelText('content-input')).toBeDefined();
	});

	it('添付画像入力欄が表示される', () => {
		render(<MessageForm />);

		expect(screen.getByLabelText('image-input')).toBeDefined();
	});

	it('送信ボタンが表示される', () => {
		render(<MessageForm />);

		expect(screen.getByText('送信')).toBeInTheDocument();
	});

	it('メッセージ入力欄が空欄のとき、送信ボタンがdisabled になっている', () => {
		render(<MessageForm />);

		const button = screen.getByText<HTMLButtonElement>('送信');
		expect(button).toBeDisabled();
	});

	it('送信ボタンを押すと、メッセージの送信処理が実行される', async () => {
		render(<MessageForm />);

		const input = screen.getByLabelText<HTMLInputElement>('content-input');
		await act(() => userEvent.type(input, 'test message'));
		screen.getByText<HTMLButtonElement>('送信').click();

		/* 送信処理をモックした関数が実行されることでテストする */
		expect(addMessageMock).toBeCalled();
	});

	it.skip('添付画像を選択した場合は、画像も指定してメッセージの送信処理が実行される', async () => {
		render(<MessageForm />);

		const contentInput = screen.getByLabelText<HTMLInputElement>('content-input');
		await act(() => userEvent.type(contentInput, 'test message'));

		const imageInput = screen.getByLabelText<HTMLInputElement>('image-input');
		const file = new File([], 'image.png', { type: 'image/png' });

		await waitFor(async () => {
			userEvent.upload(imageInput, file)
			screen.getByText<HTMLButtonElement>('送信').click();
			await waitFor(() => {
				expect(addMessageMock).toBeCalledWith(
					'test message',
					file,
					'test-user-uid'
				);
			});
		});
	});

	it('メッセージ送信処理後、メッセージ入力欄がクリアされる', async () => {
		render(<MessageForm />);

		const input = screen.getByLabelText<HTMLInputElement>('content-input');
		await act(() => userEvent.type(input, 'test message'));
		screen.getByText<HTMLButtonElement>('送信').click();

		/* 送信処理が終了して、メッセージが空に戻るまでwaitFor で待機する */
		await waitFor(() => expect(input).toHaveValue(''));
	});

	it('メッセージ送信終了後、メッセージ入力欄と添付画像入力欄がクリアされる', async () => {
		render(<MessageForm />);

		const contentInput = screen.getByLabelText<HTMLInputElement>('content-input');
		await act(() => userEvent.type(contentInput, 'test message'));

		const imageInput = screen.getByLabelText<HTMLInputElement>('image-input');
		const file = new File([], 'image.png', { type: 'image/png' });
		await act(() => userEvent.upload(imageInput, file));

		expect(contentInput).toHaveValue('test message');
		expect(imageInput.files?.[0]).toBe(file);

		screen.getByText<HTMLButtonElement>('送信').click();

		await waitFor(() => {
			expect(contentInput).toHaveValue('');
			expect(imageInput.files?.[0]).toBeUndefined();
		});
	});
});
