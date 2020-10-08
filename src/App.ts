import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import passport from "./middleware/passportConfig";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import User, { UserInstance } from "./models/User";
import ensureAuthentication from "./middleware/ensureAuthentication";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
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

app.get("/", (req: Request, res: Response) => {
  res.render(__dirname + "/views/index");
});

app.get(
  "/usersettings",
  ensureAuthentication,
  (req: Request, res: Response) => {
    res.render(__dirname + "/views/usersettings");
  }
);

app.get("/dashboard", ensureAuthentication, (req: Request, res: Response) => {
  const user = req.user as UserInstance;
  res.render(__dirname + "/views/dashboard", { user });
});

app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: UserInstance) => {
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
