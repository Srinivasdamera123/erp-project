import * as yup from "yup";

export const contractorSchema = yup
  .object({
    name: yup.string().required("Name cannot be blank"),
    totalAmount: yup
      .number()
      .required("Cannot be blank")
      .moreThan(0, "Value must be greater than zero"),
    remainingAmount: yup
      .number()
      .required("Cannot be blank")
      .positive("Must be positive"),
    project: yup.string().required("Project is required"),
    transactions: yup.array().of(
      yup.object({
        description: yup.string().required("Description cannot be blank"),
        amount: yup.number().moreThan(0, "Amount must be more than 0"),
        date: yup.date().required("date is required"),
      })
    ),
  })
  .required();
