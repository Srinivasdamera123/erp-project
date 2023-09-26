import { DocumentData } from "firebase/firestore";
import { Employee } from "../model/employee.model";

export async function employeeConverter(
  document: DocumentData
): Promise<Employee> {
  return {
    id: document.id,
    fullName: document.fullName,
    gender: document.gender,
    idProofNumber: document.idProofNumber,
    phone: document.phone,
    email: document.email,
    qualification: document.qualification,
    dateOfBirth: document.dateOfBirth,
    experience: 0,
    references: [...document.references],
    bloodGroup: document.bloodGroup,
    employeePhoto: document.employeePhoto,
    resume: document.employeePhoto,
    idProofPhoto: document.idProofPhoto,
    recruitType: document.recruitType,
  };
}
