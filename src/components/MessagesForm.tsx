import { useState, useRef, ChangeEvent } from 'react';
import { serverTimestamp } from '@/lib/firebase';
import { addMessage } from '@/lib/message';
import { useAuth } from '@/contexts/AuthContext';

export const MessageForm = () => {
	const currentUser = useAuth();

	const [content, setContent] = useState('');
	const imageInput = useRef<HTMLInputElement>(null);

	const handleChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
		setContent(e.currentTarget.value);
	};

	const handleClick = async () => {
		if (content === '') return;
		if (!currentUser.currentUser) return;

		const [image = null] = imageInput.current?.files || [];
		await addMessage(content, image, currentUser.currentUser.uid);
		setContent('');
		if (imageInput.current) imageInput.current.value = '';
	};

	return (
		<>
			<input aria-label='content-input' type='text' value={content} onChange={handleChangeContent} />
			<input aria-label='image-input' type='file' accept='image/*' ref={imageInput} />
			<button onClick={handleClick} disabled={content.length === 0}>
				送信
			</button>
		</>
	);
};
