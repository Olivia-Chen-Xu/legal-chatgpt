import { UploadedDocument } from "@/app/features/chat/models/types";
import { getDocumentText } from "@/lib/firebase/client/get-documents";

/**
 * Gathers all of the document text content and formats the text to be used in the prompt
 *
 * @param includedDocuments list of ids that the user wants to include in the query
 * @returns
 */
export async function createDocumentPrompt(includedDocuments: string[]) {
  try {
    // Fetches documents from firebase
    const documents = await getDocumentText(includedDocuments);

    if (!documents.success || !documents.data)
      throw new Error("Failed to upload document text");

    // Return back the raw text of the document
    return (
      "use the provided documents only without any interference from google data search.\n\n" +
      documents.data
        .map(
          (doc: UploadedDocument) =>
            `Document Name: ${doc.name}.\nDocument Text: ${doc.text}`
        )
        .join("\n\n")
    );
  } catch (error: unknown) {
    console.log("Error in fetching document content from Firebase");
    return "";
  }
}
