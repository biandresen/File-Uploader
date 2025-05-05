import prisma from "../db/client.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";

const userController = {
  getContent: asyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      const error = new CustomError(400, "No user found");
      return next(error);
    }

    const data = await prisma.folder.findMany({
      where: {
        userId: user.id,
        parentId: null, // top-level folders
      },
      include: {
        children: {
          include: {
            files: true, // files in child folders
          },
        },
        files: true, // files in top-level folders
      },
    });

    res.status(200).json(data);
  }),
};

export default userController;
