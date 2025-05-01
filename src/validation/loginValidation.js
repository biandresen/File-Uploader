import { body } from "express-validator";

const loginValidation = [
  body("loginEmail").trim().isEmail().withMessage("Please enter a valid email"),

  body("loginPassword").isLength({ min: 8, max: 32 }).withMessage("Invalid credentials"),
];

export default loginValidation;
