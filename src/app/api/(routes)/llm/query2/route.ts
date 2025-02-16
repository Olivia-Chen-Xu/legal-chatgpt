"use server";
import { ChatOpenAI } from "@langchain/openai";  // Make sure langchain is installed
import { apiErrorResponse } from "@/lib/utils"; // Import your custom error response handler
import { NextRequest, NextResponse } from "next/server"; // For handling Next.js requests and responses
import { getAuthenticatedUser } from "@/lib/auth/get-authenticated-user"; // For user authentication (same as your existing code)

async function* makeIterator({
  token,
  query,
  dialogFlow,
}: {
  token: string;
  query: string;
  dialogFlow: string;
}) {
  try {
    // Verify the user's authentication token
    const decodedToken = await getAuthenticatedUser();
    if (decodedToken instanceof NextResponse) return decodedToken; // Return early if user isn't authenticated

    // Initialize OpenAI with your API key
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // Using the API key from environment variables
      model: "gpt-4o-mini",  // You can adjust the model as needed
      temperature: 0.7,  // Adjust temperature for creativity control
      streaming: true,  // Enable streaming for real-time responses
    });

    // OpenAI response generation
    const encoder = new TextEncoder();
    const response = await llm.call(query);  // Query OpenAI API with the prompt provided

    // Streaming response to client
    yield encoder.encode(response.content);

  } catch (error: unknown) {
    return apiErrorResponse(error);  // Handle errors using your custom error handler
  }
}

// Convert the iterator to a ReadableStream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

// Define the POST handler for this route
export async function POST(req: NextRequest, res: NextRequest) {
  const iterator = makeIterator(await req.json());  // Extract the request data and pass to the iterator
  const stream = iteratorToStream(iterator);  // Convert iterator to a stream
  return new Response(stream);  // Return the stream to the client
}
