import { DocumentData } from "firebase/firestore";
import { AppUser } from "../model/user.model";

export async function userConverter(document: DocumentData): Promise<AppUser> {
  return {
    name: document.name,
    photoUrl: document.photoUrl,
    uid: document.uid,
    email: document.email,
  };
}
