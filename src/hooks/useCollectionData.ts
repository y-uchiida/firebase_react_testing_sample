import { Query } from 'firebase/firestore';
import { useMemo } from 'react';
import {
	useCollectionData as _useCollectionData,
} from 'react-firebase-hooks/firestore';

/**
 * firestore からコレクションデータを一括取得する  
 * react-firebase-hooks/firestore のラップ関数
 */
export const useCollectionData = <T>(
	_query: Query<T>,
	deps: unknown[] = []
) => {
	const query = useMemo(() => _query, deps);
	return _useCollectionData(query, {
		snapshotOptions: { serverTimestamps: 'estimate' }
	});
}
