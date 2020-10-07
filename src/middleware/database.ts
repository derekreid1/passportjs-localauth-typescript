import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) => console.log(err));

export default sequelize;
