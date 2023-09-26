import { Entity } from "./entity.model";

export interface Project extends Entity {
  name: string;
}
export const PROJECT_COLLECTION = "project";
