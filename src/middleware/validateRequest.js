import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors.array().map((error) => error.msg);
  console.log(errorMessages);

  if (!errors.isEmpty()) {
    const error = new CustomError(400, errorMessages);
    return next(error);
  }

  next();
};

export default validateRequest;
