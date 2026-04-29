import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface InstructorAttributes {
  id?: number;
  name: string;
}

type InstructorCreation = Optional<InstructorAttributes, "id">;

export class Instructor
  extends Model<InstructorAttributes, InstructorCreation>
  implements InstructorAttributes
{
  public id!: number;
  public name!: string;

  static initModel(sequelize: Sequelize): void {
    Instructor.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
      },
      {
        sequelize,
        tableName: "instructors",
        timestamps: false,
      }
    );
  }
}
