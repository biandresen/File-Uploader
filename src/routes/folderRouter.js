import express from "express";
import folderController from "../controllers/folderController.js";

const router = express.Router();

router.patch("/:id", folderController.editName);

export default router;
