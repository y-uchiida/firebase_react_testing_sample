import { useUsers } from '@/contexts/UsersContext';
import { Message as MessageType } from '@/types/message';
import { LoadingScreen } from './LoadingScreen';
import nonameIcon from '@/../assets/nonameIcon.png';
import { format } from 'date-fns';
import { useBlob } from '@/hooks/useBlob';

type Props = {
	message: MessageType
};

export const Message = ({ message }: Props) => {
	const { usersById, loading } = useUsers();
	const sender = usersById[message.senderId];
	const { url } = useBlob(message.imagePath);

	if (loading) return <LoadingScreen />;

	return (
		<div>
			<div>
				<img src={sender?.photoUrl || nonameIcon} alt="" />
				<span>{sender?.name || 'noname user'}</span>
				<span>
					{format(message.createdAt.toDate(), 'yyyy-MM-dd HH:mm')}
				</span>
			</div>
			<p>{message.content}</p>
			{url && <img alt="message-image" src={url} />}
		</div>
	)
}
