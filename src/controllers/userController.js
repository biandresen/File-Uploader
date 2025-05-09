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
      orderBy: { id: "asc" },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: {
                      include: {
                        children: {
                          include: {
                            children: true,
                            files: true,
                          },
                        },
                        files: true,
                      },
                    },
                    files: true,
                  },
                },
                files: true,
              },
            },
            files: true, // files in child folders
          },
        },
        files: true, // files in top-level folders
      },
    });

    res.status(200).json({
      status: "success",
      message: "User content retrieved successfully",
      data,
    });
  }),
};

export default userController;
