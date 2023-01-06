import { Factory } from 'fishery';
import { Timestamp } from 'firebase/firestore';
import { UserSecret } from '@/types/userSecrets';

export const userSecretFactory = Factory.define<UserSecret>(
	({ sequence }) => ({
		id: sequence.toString(),
		createdAt: new Date(),
		fcmToken: `token${sequence}`
	})
);
