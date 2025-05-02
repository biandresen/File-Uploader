import { body } from "express-validator";

const registerValidation = [
  body("email").trim().isEmail().withMessage("A valid email is required, like name@gmail.com"),

  body("password").isLength({ min: 6, max: 32 }).withMessage("Password must be between 6 and 32 characters"),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export default registerValidation;
