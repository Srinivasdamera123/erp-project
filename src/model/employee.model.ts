import { Timestamp } from "firebase/firestore";
import { Entity } from "./entity.model";
import { Attachment } from "./purchase.model";
import { Gender } from "./vendor.model";

export interface Employee extends Entity {
  fullName: string;
  gender: Gender;
  idProofNumber: string;
  phone: string;
  email: string;
  qualification: string;
  dateOfBirth: Timestamp;
  experience: number;
  references: Reference[];
  bloodGroup: BloodGroup;
  employeePhoto: Attachment;
  resume: Attachment;
  idProofPhoto: Attachment;
  recruitType: RecruitType;
}

export interface Reference {
  name: string;
  phone: string;
  relation: string;
}

export const Oplus = "O+ve";
export const Ominus = "O-ve";
export const Aplus = "A+ve";
export const Aminus = "A-ve";
export const Bplus = "B+ve";
export const Bminus = "B-ve";
export const ABplus = "AB+ve";
export const ABminus = "AB-ve";
export const BloodGroups = [
  Oplus,
  Ominus,
  Aplus,
  Aminus,
  Bplus,
  Bminus,
  ABplus,
  ABminus,
];

export type BloodGroup = (typeof BloodGroups)[number];

export const MARKETING = "Marketing";
export const OPERATIONS = "Operations";
export const ADMINISTRATION = "Administration";
export const RecruitTypes = [MARKETING, OPERATIONS, ADMINISTRATION];
export type RecruitType = (typeof RecruitTypes)[number];
export const EMPLOYEE_COLLECTION = "employee";
