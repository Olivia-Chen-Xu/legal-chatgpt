import { getFirestore } from "firebase-admin/firestore";

export async function getDocumentText(
  documentIds: string[]
): Promise<{ name: string; text: string }[]> {
  if (!documentIds || documentIds.length === 0) {
    return [];
  }

  const querySnapshot = await getFirestore().getAll(
    ...documentIds.map((id) => getFirestore().doc(`documents/${id}`))
  );
  return querySnapshot.map((doc) => doc.data() ?? {}) as any;
}
