import * as yup from "yup";

export const projectSchema = yup.object({
  name: yup.string().required("Name cannot be blank"),
});
