import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User, { UserAttributes, UserInstance } from "../models/user";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleStrategy = require("passport-google-oauth2").Strategy;
import dotenv from "dotenv";
import sequelize from "./database";
dotenv.config();
const LocalStrategy = passportLocal.Strategy;

// Call Signature for function done()
interface Done {
  (err: Error, user?: UserAttributes): Promise<void>;
  (err: Error, auth: boolean): void;
  (err: Error, id: number): void;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      passReqToCallback: true,
    },
    async (
      request: Request,
      accessToken: unknown,
      refreshToken: unknown,
      profile: any,
      done: any
    ) => {
      try {
        const user = await User.findOne({
          where: { username: profile.email },
        });

        if (user !== null) {
          done(null, user);
        }

        await sequelize.transaction(
          async (t): Promise<void> => {
            const users = await User.create(
              {
                username: profile.email,
                password: profile.id,
              },
              { transaction: t }
            );
            done(null, users);
          }
        );
      } catch (error) {
        done(false, error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username: string, password: string, done: Done): Promise<void> => {
      // Match user
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        done(null, false);
      }

      // Match password
      await bcrypt.compare(
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
