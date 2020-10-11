import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../middleware/database";

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
}
export type UserCreationAttributes = Optional<UserAttributes, "id">;
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User = sequelize.define<UserInstance>("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const password = this.getDataValue("password");
      return password;
    },
    set(value: string) {
      const hashed = bcrypt.hashSync(value, 10);
      this.setDataValue("password", hashed);
    },
  },
});
User.sync()
  .then(() => console.log("User succesfully synced with the database."))
  .catch((err) => console.log(err));
export default User;
