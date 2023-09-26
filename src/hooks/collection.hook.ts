import {
  DocumentData,
  QueryConstraint,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { erpFirestore } from "../lib/firebase";

export function useCollection<T>(
  path: string,
  converter: (data: DocumentData) => Promise<T>,
  ...queries: QueryConstraint[]
): [T[], () => void, boolean] {
  const [data, setData] = useState<T[]>([]);
  const [refresh, setRefresh] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(erpFirestore, path), ...queries))
      .then((snaps) => snaps.docs.map((doc) => doc.data()))
      .then((docs) => docs.map(converter))
      .then((promises) => Promise.all(promises))
      .then(setData)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return [data, () => setRefresh({}), loading];
}
