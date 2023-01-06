import { User } from "firebase/auth";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { signInGoogleWithPopup, signOut, getFcmToken } from "@/lib/firebase";
import { addUser, getUser } from "@/lib/user";
import { LoginScreen } from "@/components/LoginScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { setUserSecret } from "@/lib/userSecret";

type AuthContextValue = {
	currentUser: User | null | undefined
};

/* アプリ独自のデータを持たせたい場合はデータを追加したUser型を定義して
 * ContextValue に設定するが、今回はユーザー情報を拡張する必要がないので、
 * firebase/auth のUser をそのまま使う
 */
export const AuthContext = createContext<AuthContextValue>({
	currentUser: null,
});

export const AuthProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [currentUser, loading] = useAuthState();

	if (loading) return <LoadingScreen />
	if (!currentUser) return <LoginScreen />

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const { currentUser } = useContext(AuthContext);

	const signInWithGoogle = useCallback(async () => {
		try {
			const { user } = await signInGoogleWithPopup();
			const { isExist } = await getUser(user.uid);
			const fcmToken = await getFcmToken();
			if (!isExist) await addUser(user);
			await setUserSecret(user.uid, { fcmToken });
		} catch (e) {
			console.error(e);
			await signOut();
		}
	}, []);

	return { currentUser, signInWithGoogle, signOut };
}
