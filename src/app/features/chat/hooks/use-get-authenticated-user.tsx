import { useGlobalContext } from "@/app/store/global-context";
import { auth, db } from "@/lib/firebase/firebase-admin/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { userConverter } from "@/app/features/chat/models/types";

export function useGetAuthenticatedUser() {
  const { setUser, setAlert, setInfoAlert, setNum } = useGlobalContext();
  const router = useRouter();

  const getAuthenticatedUser = async (user: any) => {
    try {
      const docRef = doc(db, "users", user.uid).withConverter(userConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().verified) {
          setNum(docSnap.data().prompts_left);
          let data = { ...docSnap.data(), uid: docSnap.id };
          setUser(data);
          setAlert("");
        }
      } else {
        router.push("/login");
      }
    } catch (e: unknown) {
      console.error(e);
      setInfoAlert("User doesn't have priviledge to access chat.");
      router.push("/login");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Auth state resolved, user is signed in
        getAuthenticatedUser(user);
      } else {
        // Auth state resolved, but no user signed in
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);
}
