import express from "express";
import folderController from "../controllers/folderController.js";

const router = express.Router();

router.patch("/:id", folderController.editName);
router.delete("/:id", folderController.delete);

export default router;
