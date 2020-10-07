import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User, { UserInstance } from "../models/User";

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username: string, password: string, done: Function) => {
      // Match user
      const user = await User.findOne({
        where: { username: username },
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

passport.serializeUser((user: UserInstance, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done: Function) => {
  User.findByPk(id).then((user: UserInstance) => {
    if (user) {
      done(null, user.get());
    } else {
      done(null, null);
    }
  });
});

export default passport;
