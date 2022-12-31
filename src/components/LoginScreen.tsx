import { useAuth } from '@/contexts/AuthContext';

export const LoginScreen = () => {
	const { signInWithGoogle } = useAuth();
	return (
		<>
			<div>ログインしてください</div>
			<button onClick={signInWithGoogle}>
				Login with Google
			</button>
		</>
	)
}
