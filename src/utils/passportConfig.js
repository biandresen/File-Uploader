import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../db/client.js";
import { comparePassword } from "./encryption.js";

// Serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    verify
  )
);

async function verify(email, password, done) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return done(null, false, { message: "Incorrect credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return done(null, false, { message: "Incorrect credentials" });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

export default passport;
