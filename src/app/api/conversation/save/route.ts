import {
  getFirestore,
} from "firebase-admin/firestore";
import {
  arrayUnion,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "@/firebase";

import { NextResponse } from "next/server";
import { authenticateApiUser } from "@/util/api/middleware/authenticateApiUser";

import { initBackendFirebaseApp } from "@/util/api/middleware/initBackendFirebaseApp";
import { userConverter } from "@/util/User";
import { firestore } from "firebase-admin";

// Get all documents owned by the user in the authentication header
export async function GET(_: Request) {
  const { earlyResponse, decodedToken } = await authenticateApiUser();
  if (earlyResponse) {
    return earlyResponse;
  }

  if (!decodedToken) {
    return NextResponse.json(
      { error: "decodedToken is missing but there was no earlyResponse" },
      { status: 500 }
    );
  }

  const queryResults = await getFirestore()
    .collection("conversations")
    .where("userUid", "==", decodedToken.user_id)
    .get();

  const plainJsObjects = queryResults.docs.map((doc) => {
    const data = doc.data();
    return { ...data, uid: doc.id };
  });

  return NextResponse.json({ documents: plainJsObjects }, { status: 200 });
}

// Upload a document
// This endpoint requires Node v20 or later
// If this is failing locally, check your node version by running `node -v` in the terminal
export async function POST(req: Request) {

  const { earlyResponse, decodedToken } = await authenticateApiUser();
  if (earlyResponse) {
    return earlyResponse;
  }

  if (!decodedToken) {
    return NextResponse.json(
      { error: "decodedToken is missing but there was no earlyResponse" },
      { status: 500 }
    );
  }

  const { fullConversation, includedDocuments } = await req.json();

  initBackendFirebaseApp();
  
  try {

    const docRef = await getFirestore().collection("conversations").doc()
    
    await docRef.create({
      conversation: fullConversation,
      documents: includedDocuments,
    });

    console.log(docRef.id);
    const userDocRef = getFirestore().collection("users").doc(decodedToken.user_id).withConverter(userConverter);
    
    const data = await userDocRef.get()
    const to_update = ((data == null) ? [] : data.data().conversations).concat([docRef.id]);
    console.log(to_update);
    await userDocRef.update({conversations: to_update});
    return NextResponse.json(
      {
        docRef
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
