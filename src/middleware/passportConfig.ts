import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User, { UserAttributes, UserInstance } from "../models/user";

const LocalStrategy = passportLocal.Strategy;

// Call Signature for function done()
interface Done {
  (err: Error, user?: UserAttributes): Promise<void>;
  (err: Error, auth: boolean): void;
  (err: Error, id: number): void;
}

passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username: string, password: string, done: Done): Promise<void> => {
      // Match user
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        done(null, false);
      }

      // Match password
      bcrypt.compare(
        password,
        user.password,
        (err: Error, isMatch: boolean): void => {
          if (err) throw err;
          if (isMatch) {
            done(null, user);
          } else {
            done(null, false);
          }
        }
      );
    }
  )
);

passport.serializeUser((user: UserInstance, done: Done): void => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id: number, done: Done): Promise<void> => {
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
  }
);

export default passport;
