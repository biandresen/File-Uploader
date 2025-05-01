import { hashPassword, comparePassword } from "../utils/encryption.js";
import { matchedData } from "express-validator";
import prisma from "../db/client.js";

const authController = {
  register: async (req, res, next) => {
    console.log("Registering...");
    const { registerEmail: email, registerPassword: password } = matchedData(req);
    console.log(email, password);

    // check if email already exists, if so send fail response with custom error
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists)
      return res.status(400).json({
        status: "fail",
        message: "Email already exists. Please enter another email",
      });

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
  },
};

export default authController;
