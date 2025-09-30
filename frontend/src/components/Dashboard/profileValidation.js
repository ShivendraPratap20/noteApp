import * as Yup from "yup";

const ProfileValidationSchema = Yup.object({
  userName: Yup.string()
    .min(5, 'Name must be at least 5 characters')
    .required('Name is required'),

  userID: Yup.string()
    .email('Invalid email')
    .required('Enter valid email address'),

  phoneNumber: Yup.string()
    .min(10, "Phone Number must be of 10 digits")
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
});

export default ProfileValidationSchema;
