import { DocumentData } from "firebase/firestore";
import { Project } from "../model/project.model";

export async function projectConverter(
  document: DocumentData
): Promise<Project> {
  return {
    id: document.id,
    name: document.name,
  };
}
