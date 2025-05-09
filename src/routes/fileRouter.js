import express from "express";
import fileController from "../controllers/fileController.js";
import ensureAuthenticated from "../middleware/ensureAuthenticated.js";

const router = express.Router();

router.post("", ensureAuthenticated, fileController.createFile);
router.patch("/:id", ensureAuthenticated, fileController.editName);
router.delete("/:id", ensureAuthenticated, fileController.delete);

export default router;
