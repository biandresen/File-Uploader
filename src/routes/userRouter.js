import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/get-content", userController.getContent);

export default router;
