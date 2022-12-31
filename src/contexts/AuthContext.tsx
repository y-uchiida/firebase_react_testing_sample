import { User } from "firebase/auth";
import { createContext, ReactNode, useContext } from "react";
import { useAuthState } from '@/hooks/useAuthState';

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
	const [currentUser] = useAuthState();

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const { currentUser } = useContext(AuthContext);

	return { currentUser };
}
