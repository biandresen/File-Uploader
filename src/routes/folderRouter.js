import express from "express";
import folderController from "../controllers/folderController.js";
import ensureAuthenticated from "../middleware/ensureAuthenticated.js";

const router = express.Router();

router.get("/", ensureAuthenticated, folderController.getAllFolders);
router.post("/", ensureAuthenticated, folderController.createFolder);
router.patch("/:id", ensureAuthenticated, folderController.editName);
router.delete("/:id", ensureAuthenticated, folderController.delete);

export default router;
