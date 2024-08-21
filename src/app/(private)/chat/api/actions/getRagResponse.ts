"use server";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeIndexes } from "../../enum/enums";
import admin from "firebase-admin";

export async function getRagResponse(
  token: string,
  query: string,
  namespace: string = "",
  indexName = PineconeIndexes.staticDocuments
) {
  try {
    console.log("THE RAG INDEX NAME IS: ", indexName);
    console.log("THE RAG NAMESPACE IS: ", namespace);
    const decodedToken = admin.auth().verifyIdToken(token);
    
    // ********************************* CREATING A VECTOR STORE ********************************* //
    const pinecone = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || "",
    });

    const pineconeIndex = pinecone.Index(indexName);

    // Create a vectore store (database of vectors) with the specified LLM and pinecone index
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex,
      }
    );

    vectorStore.namespace = namespace; //Specify the namespace to use

    // ********************************* SEMANTIC SEARCH ********************************* //
    const retriever = vectorStore.asRetriever();

    // ********************************* CREATING A PROMPT FOR RAG ********************************* //
    const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

    // ********************************* LLM INITIALIZATION ********************************* //
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo-0125",
      temperature: 0,
    });

    // ********************************* CHAIN THAT IMPLEMENTS RAG ********************************* //
    // Create a chain that passes a list of documents to a model.
    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
      outputParser: new StringOutputParser(),
    });

    // ********************************* DOCUMENT RETRIEVAL ********************************* //
    const retrievedDocs = await retriever.getRelevantDocuments(query);

    // ********************************* INVOKING RAG ********************************* //
    const res = await ragChain.invoke({
      question: query,
      context: retrievedDocs,
    });

    return { ok: true, data: res };
  } catch (error) {
    return { ok: false, data: null };
  }
}
