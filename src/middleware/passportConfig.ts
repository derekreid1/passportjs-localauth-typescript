import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User, { UserAttributes, UserInstance } from "../models/User";

const LocalStrategy = passportLocal.Strategy;

// Call Signature for function done()
interface Done {
  (err: Error, user?: UserAttributes);
  (err: Error, auth: boolean);
  (err: Error, id: number);
}

passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username: string, password: string, done: Done) => {
      // Match user
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        return done(null, false);
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

passport.serializeUser((user: UserInstance, done: Done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: Done) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      done(null, user.get());
    } else {
      done(null, null);
    }
  } catch (error) {
    console.log(error);
  }
});

export default passport;
