import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import passport from "./middleware/passportConfig";
import session from "express-session";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import router from "./routes/routes";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(expressLayouts);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.set("layout", "./layouts/full-width.ejs");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET_CODE || "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
