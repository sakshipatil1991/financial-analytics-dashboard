import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// Attributes stored in the "transactions" table.
// "id" here is the same business id from the sample JSON (1, 2, 3, ...),
// used directly as the primary key to keep things simple.
interface TransactionAttributes {
  id: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

type TransactionCreationAttributes = Optional<TransactionAttributes, "user_profile">;

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public date!: Date;
  public amount!: number;
  public category!: string;
  public status!: string;
  public user_id!: string;
  public user_profile!: string;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false, // we provide the id ourselves from the sample data
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_profile: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: true,
    indexes: [
      { fields: ["date"] },
      { fields: ["category"] },
      { fields: ["status"] },
      { fields: ["user_id"] },
      { fields: ["amount"] },
    ],
  }
);

export default Transaction;
