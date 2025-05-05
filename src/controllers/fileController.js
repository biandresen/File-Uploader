import CustomError from "../utils/CustomError.js";
import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const fileController = {
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
      data: {
        updatedFile,
      },
    });
  }),
};

export default fileController;
