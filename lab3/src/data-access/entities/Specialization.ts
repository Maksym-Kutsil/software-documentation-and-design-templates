import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface SpecializationAttributes {
  id?: number;
  name: string;
  description: string;
}

type SpecializationCreation = Optional<SpecializationAttributes, "id">;

export class Specialization
  extends Model<SpecializationAttributes, SpecializationCreation>
  implements SpecializationAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;

  static initModel(sequelize: Sequelize): void {
    Specialization.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: false },
      },
      {
        sequelize,
        tableName: "specializations",
        timestamps: false,
      }
    );
  }
}
