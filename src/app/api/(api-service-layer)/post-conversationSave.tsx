import { auth } from "@/lib/firebase/firebase-admin/firebase";

/**
 * Note: Remember to change the URL to the 
 * 
 * @param fullConversation 
 * @param includedDocuments 
 * @param title 
 * @returns 
 */
export async function postConversationSave(
  fullConversation: object[],
  includedDocuments: string[],
  title: string
) {
  return await fetch("/api/conversation/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify({ conversation: fullConversation, includedDocuments, title}),
  });
}



