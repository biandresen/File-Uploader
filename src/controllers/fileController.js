import CustomError from "../utils/CustomError.js";
import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const fileController = {
  createFile: asyncErrorHandler(async (req, res, next) => {
    const { name, link, extension, size, id } = req.body;

    if (!name) return next(CustomError(400, "File name is missing"));
    if (!id) return next(CustomError(404, "Parent file not found"));

    console.log({ name, link, extension, size, id });
    const createdFile = await prisma.file.create({
      data: {
        name,
        link,
        size: Number(size),
        extension,
        folderId: id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "File created successfully",
      data: createdFile,
    });
  }),
  editName: asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return next(CustomError(400, "Didn't get a new name"));
    }

    if (!id) {
      return next(CustomError(400, "File ID is missing"));
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
      return next(CustomError(400, "File ID is missing"));
    }

    await prisma.file.delete({
      where: { id: Number(id) },
    });

    res.status(204);
  }),
};

export default fileController;
