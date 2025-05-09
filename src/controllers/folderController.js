import CustomError from "../utils/CustomError.js";
import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const folderController = {
  getAllFolders: asyncErrorHandler(async (req, res, next) => {
    const userId = req.user?.id;
    console.log(userId);
    const folders = await prisma.folder.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
    if (!folders) return next(CustomError(500, "Couldn't get folders. Try again later..."));

    res.status(200).json({
      status: "success",
      message: "All folders retreived successfully",
      folders,
    });
  }),
  createFolder: asyncErrorHandler(async (req, res, next) => {
    const { name, id } = req.body;

    if (!name) return next(CustomError(400, "Folder name is missing"));
    if (typeof id === "undefined") return next(CustomError(400, "Folder ID is missing"));

    if (id !== null) {
      const parentFolder = await prisma.folder.findUnique({ where: { id } });
      if (!parentFolder) return next(CustomError(404, "Parent folder not found"));
    }

    const createdFolder = await prisma.folder.create({
      data: {
        name,
        parentId: id,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Folder created successfully",
      data: createdFolder,
    });
  }),

  editName: asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) return next(CustomError(400, "Didn't get a new name"));

    if (!id) return next(CustomError(400, "Folder ID is missing"));

    const updatedFolder = await prisma.folder.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json({
      status: "success",
      message: "Folder updated successfully",
      data: updatedFolder,
    });
  }),
  delete: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(CustomError(400, "Folder ID is missing"));

    await prisma.folder.delete({
      where: { id: Number(id) },
    });

    res.status(204);
  }),
};

export default folderController;
