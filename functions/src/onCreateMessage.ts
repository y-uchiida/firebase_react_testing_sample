import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getCollectionData, getDocumentData } from "./lib/firebase";
import { userRef } from "./lib/user";
import { UserDocumentData } from "./shared/types/user";
import { userSecretsRef } from "./lib/userSecret";
import type { UserSecretDocumentData } from "./shared/types/userSecrets";

export const onCreateMessage = functions
	.region("asia-northeast1")
	.firestore.document("messages/{messageId")
	.onCreate(
		async (snapshot: functions.firestore.QueryDocumentSnapshot) => {
			const { senderId, content } = snapshot.data();
			const sender = await getDocumentData<UserDocumentData>(userRef(senderId));
			const notification = {
				title: `${sender.name} さんからメッセージが届きました`,
				body: content
			};
			const secrets = await getCollectionData<UserSecretDocumentData>(
				userSecretsRef
			);
			await Promise.allSettled(
				secrets.map(({ fcmToken }) =>
					admin.messaging().send({ token: fcmToken, notification })
				)
			);
		}
	);
