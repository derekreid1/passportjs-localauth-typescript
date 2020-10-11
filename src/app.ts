import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import passport from "./middleware/passportConfig";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import User, { UserInstance } from "./models/user";
import ensureAuthentication from "./middleware/ensureAuthentication";
import expressLayouts from "express-ejs-layouts";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(expressLayouts);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

app.set("layout", "./layouts/full-width.ejs");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/about", (req: Request, res: Response) => {
  res.render("about", { layout: "./layouts/sidebar", title: "About" });
});

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Home" });
});

app.get(
  "/usersettings",
  ensureAuthentication,
  (req: Request, res: Response) => {
    res.render("usersettings", { title: "User Settings" });
  }
);

app.get(
  "/dashboard",
  ensureAuthentication,
  (req: Request, res: Response): void => {
    const user = req.user as UserInstance;
    res.render("dashboard", { user, title: "Dashboard" });
  }
);

app.post("/login", (req: Request, res: Response, next: NextFunction): void => {
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
});

User.create({
  username: "admin",
  password: "admin",
}).catch((err: Error) => console.log(err));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
