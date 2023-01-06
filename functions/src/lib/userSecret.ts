import {
	db,
	CollectionReference,
} from "./firebase";
import { UserSecretDocumentData } from "../shared/types/userSecrets";

export const userSecretsRef = db.collection(
	"userSecrets"
) as CollectionReference<UserSecretDocumentData>;
