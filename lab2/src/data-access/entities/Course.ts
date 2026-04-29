import { DataTypes, Model, Sequelize } from "sequelize";

export interface CourseAttributes {
  id?: number;
  name: string;
  specializationId: number;
  instructorId: number;
}

export class Course
  extends Model<CourseAttributes>
  implements CourseAttributes
{
  declare id: number;
  declare name: string;
  declare specializationId: number;
  declare instructorId: number;

  static initModel(sequelize: Sequelize): typeof Course {
    Course.init(
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
        specializationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "specialization_id",
        },
        instructorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "instructor_id",
        },
      },
      {
        sequelize,
        tableName: "courses",
        timestamps: false,
      }
    );
    return Course;
  }
}
