import CustomError from "../utils/CustomError.js";
import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import cloudinary from "../fileManagement/fileService.js";
import fs from "fs/promises";

const fileController = {
  createFile: asyncErrorHandler(async (req, res, next) => {
    const { name, folderId } = req.body;
    const file = req.file;

    if (!file) return next(new CustomError(400, "No file uploaded"));

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "App_FileUploader",
    });

    // Get file metadata
    const extension = file.originalname.split(".").pop();
    const size = file.size / (1024 * 1024); // Convert bytes to MB

    // Delete temp file
    await fs.unlink(file.path);

    // Save in DB
    const createdFile = await prisma.file.create({
      data: {
        name,
        extension,
        size: parseFloat(size.toFixed(2)),
        folderId: parseInt(folderId),
        link: uploadResult.secure_url,
      },
    });

    res.status(201).json({
      status: "success",
      message: "File uploaded and saved",
      data: createdFile,
    });
  }),
  editName: asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return next(new CustomError(400, "Didn't get a new name"));
    }

    if (!id) {
      return next(new CustomError(400, "File ID is missing"));
    }

    const updatedFile = await prisma.file.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json({
      status: "success",
      message: "File updated successfully",
      data: updatedFile,
    });
  }),
  delete: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new CustomError(400, "File ID is missing"));
    }

    await prisma.file.delete({
      where: { id: Number(id) },
    });

    res.status(204);
  }),
};

export default fileController;
