import { body } from "express-validator";

const registerValidation = [
  body("registerEmail").trim().isEmail().withMessage("A valid email is required"),

  body("registerPassword")
    .isLength({ min: 6, max: 32 })
    .withMessage("Password must be between 6 and 32 characters"),

  body("registerConfirmPassword")
    .custom((value, { req }) => value === req.body.registerPassword)
    .withMessage("Passwords do not match"),
];

export default registerValidation;
