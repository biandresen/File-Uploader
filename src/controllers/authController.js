import { hashPassword } from "../utils/encryption.js";
import passport from "passport";
import { matchedData } from "express-validator";
import prisma from "../db/client.js";
import CustomError from "../utils/CustomError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const authController = {
  register: asyncErrorHandler(async (req, res, next) => {
    console.log("Registering...");
    const { email, password } = matchedData(req);

    // check if email already exists, if so send fail response with custom error
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      const error = new CustomError(400, "Email already exists. Please enter another email");
      return next(error);
    }

    // hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // save email and hashed password in database via Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(user);

    // send success response + auto-login via passport (do this from browser)
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
    });

    console.log("Register done: User registered successfully");
  }),

  login: (req, res, next) => {
    console.log("Logging in...");
    passport.authenticate("local", (err, user, message) => {
      if (err) return next(err);

      if (!user) {
        const error = new CustomError(400, message.message);
        return next(error);
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        const { password, id, ...userWithoutPassword } = user;
        return res.json({
          status: "success",
          user: userWithoutPassword,
        });
      });
      console.log("Login done");
    })(req, res, next);
  },
};

export default authController;
