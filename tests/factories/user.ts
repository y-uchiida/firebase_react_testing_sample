import { Factory } from 'fishery';
import { User } from '@/types/user';

export const userFactory = Factory.define<User>(
	({ sequence }) => ({
		id: sequence.toString(),
		createdAt: new Date(),
		name: `テストユーザー ${sequence}`,
		photoUrl: '',
	})
);
