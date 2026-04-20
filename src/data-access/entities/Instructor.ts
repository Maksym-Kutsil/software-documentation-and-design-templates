import { DataTypes, Model, Sequelize } from "sequelize";

export interface InstructorAttributes {
  id?: number;
  name: string;
}

export class Instructor
  extends Model<InstructorAttributes>
  implements InstructorAttributes
{
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): typeof Instructor {
    Instructor.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "instructors",
        timestamps: false,
      }
    );
    return Instructor;
  }
}
