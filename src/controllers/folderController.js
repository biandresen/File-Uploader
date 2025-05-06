import CustomError from "../utils/CustomError.js";
import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const folderController = {
  editName: asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return next(CustomError(400, "Didn't get a new name"));
    }

    if (!id) {
      return next(CustomError(400, "Folder ID is missing"));
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json({
      status: "success",
      data: updatedFolder,
    });
  }),
};

export default folderController;
