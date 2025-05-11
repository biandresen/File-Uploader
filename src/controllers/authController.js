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
    if (emailExists) return next(new CustomError(400, "Email already exists. Please enter another email"));

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

      if (!user) return next(new CustomError(400, message.message));

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

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(new CustomError(500, err.message));

      req.session.destroy(() => {
        res.clearCookie("connect.sid"); // name depends on your session config
        res.status(200).json({
          status: "success",
          message: "Logged out",
        });
      });
    });
  },

  checkAuth: (req, res) => {
    console.log("CHECKING AUTH");
    if (req.isAuthenticated()) {
      const { password, ...safeUser } = req.user;
      res.json({ loggedIn: true, user: safeUser }); //No password sent to frontend
    } else {
      res.json({ loggedIn: false });
    }
  },
};

export default authController;
