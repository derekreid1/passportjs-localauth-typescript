import { NextFunction, Request, Response, Router } from "express";
import ensureAuthentication from "../middleware/ensureAuthentication";
import passport from "../middleware/passportConfig";
import { UserInstance } from "../models/user";
import Userrouter from "./controllers/usercontroller";

const router = Router();
router.use(Userrouter);

router.get("/about", (req: Request, res: Response) => {
  res.render("about", { layout: "./layouts/sidebar", title: "About" });
});

router.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Home" });
});

router.get(
  "/usersettings",
  ensureAuthentication,
  (req: Request, res: Response) => {
    res.render("usersettings", { title: "User Settings" });
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req: Request, res: Response) => {
    res.redirect("/dashboard");
  }
);

router.get(
  "/dashboard",
  ensureAuthentication,
  (req: Request, res: Response): void => {
    const user = req.user as UserInstance;
    res.render("dashboard", { user, title: "Dashboard" });
  }
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/logout", (req: Request, res: Response) => {
  req.logOut();
  res.redirect("/");
});

router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate("local", (err: Error, user: UserInstance): void => {
      if (err) throw err;
      if (!user) {
        res.send("No user exists");
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          // res.json({auth: true, userid: user.id});
          res.redirect("/dashboard");
        });
      }
    })(req, res, next);
  }
);

export default router;
