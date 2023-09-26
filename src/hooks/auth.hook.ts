import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { erpFirestore } from "../lib/firebase";
import { AppUser, USER_COLLECTION } from "../model/user.model";

export function useAuth(): [boolean, AppUser | null] {
  const [loading, setLoading] = useState(true);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  useEffect(() => {
    return onAuthStateChanged(getAuth(), async (user) => {
      if (user && !appUser) {
        try {
          await getDoc(doc(erpFirestore, "/allowedUsers", user.uid));
          const newUser: AppUser = {
            uid: user.uid,
            photoUrl: user.photoURL || "",
            email: user.email || "",
            name: user.displayName || "",
          };
          await setDoc(doc(erpFirestore, USER_COLLECTION, user.uid), {
            ...newUser,
          });
          setAppUser(newUser);
        } catch (error) {
          console.error(error);
          setAppUser(null);
          getAuth().signOut();
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [loading, appUser];
}
