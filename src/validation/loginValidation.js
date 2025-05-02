import { body } from "express-validator";

const loginValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),

  body("password").isLength({ min: 6, max: 32 }).withMessage("Invalid credentials"),
];

export default loginValidation;
