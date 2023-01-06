import { Factory } from 'fishery';
import { Message } from '@/types/message';

export const messageFactory = Factory.define<Message>(
	({ sequence }) => ({
		id: sequence.toString(),
		createdAt: new Date(),
		content: '',
		imagePath: null,
		senderId: '',
	})
)
