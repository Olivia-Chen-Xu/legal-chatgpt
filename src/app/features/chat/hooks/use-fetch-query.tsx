import { auth } from "@/lib/firebase/firebase-admin/firebase";
import { useGlobalContext } from "../../../store/global-context";
import useUpsertConversation from "./use-upsert-conversation";
import { errorResponse } from "@/lib/utils";
import { useFetchLLM } from "@/app/(private)/chat/lib/llm/use-fetch-llm";
import { useGlobalDialogFlowStore } from "../components/dialog-flows/store";

const useFetchQuery = () => {
  const { fetchLLMResponse } = useFetchLLM();
  const { upsertConversation } = useUpsertConversation();
  const {
    setAlert,
    setShowStartupImage,
    setPdfLoading,
    setLoading,
    setUserQuery,
    setConversation,
    conversation,
    setInfoAlert,
    handleBeforeUnload,
    includedDocuments,
    num,
    userScrolling,
  } = useGlobalContext();
  const { compiledDialogFlow } = useGlobalDialogFlowStore();

  const fetchQuery = async (queryInput: string) => {
    // Checks if the user used up their available number of prompts
    if (num <= 0) {
      setInfoAlert("No more prompts available...");
    }

    if (queryInput === "") return;

    // Check for authentication
    if (!auth.currentUser) {
      setAlert("Missing auth.currentUser");
      return;
    }

    userScrolling.current = false;
    setShowStartupImage(false);
    setLoading(true);
    setPdfLoading(true);
    setUserQuery("");

    // Prompts the user from leaving the page before the conversation is complete
    window.addEventListener("beforeunload", handleBeforeUnload);

    try {
      // New full conversation the LLM will add to
      const fullConversation = conversation.concat([
        {
          role: "user",
          content: queryInput,
        },
        {
          role: "assistant",
          content: "",
        },
      ]);

      // Displays the user's query first
      setConversation(fullConversation);

      // Calls LLM to generate response to query
      await fetchLLMResponse(
        fullConversation,
        queryInput,
        includedDocuments,
        compiledDialogFlow?.prompt ?? null
      );
      // Save or update the conversation after calling
      upsertConversation(fullConversation);
    } catch (error: any) {
      setInfoAlert(errorResponse(error));
      setLoading(false);
      setPdfLoading(false);
    }
  };

  return {
    fetchQuery,
  };
};

export default useFetchQuery;