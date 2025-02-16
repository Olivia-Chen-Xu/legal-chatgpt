"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useGlobalContext } from "../../store/global-context";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

import "@/app/features/chat/chat.css";
import { Label } from "@/components/ui/label";
import { cn, errorResponse } from "@/lib/utils";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-admin/firebase";
import logo_png from "@/assets/oj_logo.png";
import { useRouter } from "next/navigation";
import { useGetAuthenticatedUser } from "@/app/features/chat/hooks/use-get-authenticated-user";
import { getDocumentsOwnedByUser } from "@/app/api/(api-service-layer)/get-documents-owned-by-user";
import { getConversationTitles } from "@/app/api/(api-service-layer)/get-conversation-titles";
import { getConversation } from "@/app/api/(api-service-layer)/get-conversation";
import { Conversation } from "@/app/features/chat/components/conversation/conversation";
import useFetchQuery from "@/app/features/chat/hooks/use-fetch-query";
import { ConversationQuery } from "@/app/features/chat/components/conversation-query/conversation-query";
import { useDebouncedCallback } from "use-debounce";

export default function Chat() {
  const {
    alert,
    setAlert,
    setConversationTitles,
    setConversationId,
    infoAlert,
    setInfoAlert,
    setDocuments,
    showStartupImage,
    conversation,
    setConversation,
    latestResponse,
    scrollIntoViewRef,
    conversationId,
    userScrolling,
  } = useGlobalContext();
  useGetAuthenticatedUser();
  const router = useRouter();
  const { fetchQuery } = useFetchQuery();

  /**
   * Scrolls the conversation downwards while the LLM is generating output
   */
  useEffect(() => {
    if (scrollIntoViewRef?.current && !userScrolling.current) {
      scrollIntoViewRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [latestResponse, conversation]);

  /**
   * Wrapper function to fetch selected previous conversation
   *
   * @returns
   */
  async function getSelectedConversation() {
    try {
      const selectedConversationContent = await getConversation(conversationId);
      if (!selectedConversationContent) return;

      // Update the chat conversation and the selected conversation Uid
      setConversation(selectedConversationContent?.conversation);
      setConversationId(selectedConversationContent.conversationId); // Note the conversationId is used to find
    } catch (error: any) {
      toast({
        title: "Failed to get conversation",
        variant: "destructive",
      });
    }
  }

  // Allows user to scroll away from the generating text
  const detectUserScroll = useDebouncedCallback(() => {
    userScrolling.current = true; // Flag that user has scrolled
  }, 10);

  /**
   *  Changes the conversation based on the selected conversation title
   */
  useEffect(() => {
    getSelectedConversation();
  }, [conversationId]);

  /**
   * Authenticating User and getting user documents and setting conversation titles
   */
  useEffect(() => {
    setAlert("Authenticating user...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // if (user && !user.emailVerified) {
        //   toast({
        //     title: "Email has not been verified.",
        //     variant: "destructive",
        //   });
        //   router.push("/login");
        // }
        setDocuments(await getDocumentsOwnedByUser()); // Retrieves uploaded documents by user
        setConversationTitles(await getConversationTitles()); // Retrieves past conversations
      } catch (error: unknown) {
        setInfoAlert(errorResponse(error));
      }
    });

    // Listen for user scroll start (e.g., mouse wheel or touch events)
    window.addEventListener("wheel", detectUserScroll, { passive: true });
    window.addEventListener("touchmove", detectUserScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", detectUserScroll);
      window.removeEventListener("touchmove", detectUserScroll);
      setInfoAlert(""); // Clearing alerts if needed
      if (unsubscribe) unsubscribe(); // Ensures unsubscribe is called only if it's defined
    };
  }, []);

  const handleQueryPrompt = (prompt: string) => {
    fetchQuery(prompt);
  };

  return (
    <>
      <Toaster />
      <div className="flex justify-center relative w-full overflow-hidden h-[100vh] items-start">
        {/* Main Content */}
        <div
          className={cn(
            "w-full h-[100%] grid grid-rows-[1fr_auto] pt-[60px] lg:pt-[30px] relative"
          )}
        >
          {/* Open Justice Background Information */}
          {showStartupImage && (
            <div className="relative self-center w-full md:w-chat mx-auto">
              <div className="flex flex-col gap-[10px] items-center max-w-[708px] mx-[auto]">
                <div className="p-3 flex flex-col gap-2">
                  <div className="w-[150px] md:w-[400px] h-auto aspect-[1096/192] relative">
                    <Image
                      src={logo_png}
                      alt="Open Justice Powered by the Conflict Analytics Lab"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Label className="text-center text-base w-full text-[#838383]">
                    Ask any legal questions.
                  </Label>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
                  {[
                    "Data Privacy",
                    "Service Terms",
                    "GDPR Rules",
                    "Copyright Laws",
                  ].map((prompt, key) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="bg-transparent flex rounded-[3rem] hover:bg-[#F1F1F1] cursor-pointer h-auto py-1 px-4 text-nowrap"
                      onClick={() => handleQueryPrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conversation */}
          <Conversation />

          {/* Query Input Text Field */}
          <ConversationQuery />
        </div>

        {/* Alert Modal */}
        <AlertDialog open={!!alert}>
          <AlertDialogTitle className="hidden"></AlertDialogTitle>
          <AlertDialogContent onOpenAutoFocus={(e: any) => e.preventDefault()}>
            <AlertDialogDescription className="text-base text-[black]">
              {alert}
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>

        {/* Info Alert Modal */}
        <Dialog open={!!infoAlert}>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogContent onOpenAutoFocus={(e: any) => e.preventDefault()}>
            <DialogDescription className="text-base text-[black]">
              {infoAlert}
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setInfoAlert("")}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
