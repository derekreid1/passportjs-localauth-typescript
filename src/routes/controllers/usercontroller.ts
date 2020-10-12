import { Router, Request, Response } from "express";
import sequelize from "../../middleware/database";
import User from "../../models/user";
const Userrouter = Router();

Userrouter.route("/users").get(getUsers).post(createUser);

async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
}

async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.create(
        {
          username: req.body.username,
          password: req.body.password,
        },
        { transaction: t }
      );
      return user;
    });

    req.logIn(result, (err: Error) => {
      if (err) throw new Error("Error at: req.logIn");
      res.redirect("/dashboard");
    });
  } catch (error) {
    res.json(error);
  }
}

export default Userrouter;
