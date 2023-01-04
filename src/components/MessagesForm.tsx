import { useState, ChangeEvent } from 'react';
import { serverTimestamp } from '@/lib/firebase';
import { addMessage } from '@/lib/message';
import { useAuth } from '@/contexts/AuthContext';

export const MessageForm = () => {
	const currentUser = useAuth();

	const [content, setContent] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setContent(e.currentTarget.value);
	};

	const handleClick = async () => {
		if (content === '') return;
		if (!currentUser.currentUser) return;

		await addMessage({
			content,
			senderId: currentUser.currentUser.uid,
			createdAt: serverTimestamp()
		});
		setContent('');
	};

	return (
		<>
			<input
				aria-label='content-input'
				type="text"
				value={content}
				onChange={handleChange}
			/>
			<button onClick={handleClick} disabled={content.length === 0}>
				送信
			</button>
		</>
	);
};
