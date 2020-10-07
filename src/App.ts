import express, { Request, Response, NextFunction } from "express";
import passport from "./middleware/passportConfig";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import User, { UserInstance } from "./models/User";
import ensureAuthentication from "./middleware/ensureAuthentication";

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
  res.render(__dirname + "/public/index");
});

app.get(
  "/usersettings",
  ensureAuthentication,
  (req: Request, res: Response) => {
    res.render(__dirname + "/public/usersettings");
  }
);

app.get("/dashboard", ensureAuthentication, (req: Request, res: Response) => {
  const user = <UserInstance>req.user;
  res.render(__dirname + "/public/dashboard", { user: user });
});

app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.send("No user exists");
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        //res.json({auth: true, userid: user.id});
        res.redirect("/dashboard");
      });
    }
  })(req, res, next);
});

User.create({
  username: "admin",
  password: "admin",
}).catch((err: any) => console.log(err));

app.listen(8000, () =>
  console.log(`Server running at http://localhost:${8000}`)
);
