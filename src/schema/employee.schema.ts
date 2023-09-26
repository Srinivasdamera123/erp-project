import * as yup from "yup";
import { BloodGroups, RecruitTypes } from "../model/employee.model";
import { Genders } from "../model/vendor.model";

export const employeeSchema = yup
  .object({
    fullName: yup.string().required("Full name cannot be blank"),
    gender: yup
      .string()
      .required("Please choose a gender")
      .oneOf([...Genders]),
    idProofNumber: yup.string().required("Id proof number cannot be blank"),
    phone: yup.string().required("Number cannot be blank"),
    email: yup.string().email().required("Email cannot be blank"),
    qualification: yup.string().nullable(),
    dateOfBirth: yup.date().required("Date of birth cannot be blank"),
    experience: yup.number().nullable(),
    bloodGroup: yup
      .string()
      .required("Please choose a blood group")
      .oneOf([...BloodGroups]),
    employeePhoto: yup.string().required("Please upload employee photo"),
    resume: yup.string().nullable(),
    idProofPhoto: yup.string().required("Please upload ID proof photo"),
    recruitType: yup
      .string()
      .required("Please choose a type")
      .oneOf([...RecruitTypes]),
    references: yup.array().of(
      yup.object({
        name: yup.string().nullable(),
        phone: yup.string().nullable(),
        relation: yup.string().nullable(),
      })
    ),
  })
  .required();
