import { body } from "express-validator";

const loginValidation = [body("email").trim().isEmail().withMessage("Please enter a valid email")];

export default loginValidation;
