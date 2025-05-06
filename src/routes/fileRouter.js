import express from "express";
import fileController from "../controllers/fileController.js";

const router = express.Router();

router.patch("/:id", fileController.editName);
router.delete("/:id", fileController.delete);

export default router;
