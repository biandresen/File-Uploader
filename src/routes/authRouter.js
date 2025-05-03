import express from "express";
import authController from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import registerValidation from "../validation/registerValidation.js";
import loginValidation from "../validation/loginValidation.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, authController.register);
router.post("/login", loginValidation, validateRequest, authController.login);
router.get("/check-auth", authController.checkAuth);

export default router;
