import { DataTypes, Model, Sequelize } from "sequelize";

export interface WeekAttributes {
  id?: number;
  number: number;
  deadline: string;
  courseId: number;
}

export class Week extends Model<WeekAttributes> implements WeekAttributes {
  declare id: number;
  declare number: number;
  declare deadline: string;
  declare courseId: number;

  static initModel(sequelize: Sequelize): typeof Week {
    Week.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        number: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        deadline: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "course_id",
        },
      },
      {
        sequelize,
        tableName: "weeks",
        timestamps: false,
      }
    );
    return Week;
  }
}
