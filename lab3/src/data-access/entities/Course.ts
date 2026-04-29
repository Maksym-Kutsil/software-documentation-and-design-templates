import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface CourseAttributes {
  id?: number;
  name: string;
  description: string;
  durationWeeks: number;
  specializationId: number;
  instructorId: number;
}

type CourseCreation = Optional<CourseAttributes, "id">;

export class Course
  extends Model<CourseAttributes, CourseCreation>
  implements CourseAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public durationWeeks!: number;
  public specializationId!: number;
  public instructorId!: number;

  static initModel(sequelize: Sequelize): void {
    Course.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        durationWeeks: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "duration_weeks",
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
  }
}
