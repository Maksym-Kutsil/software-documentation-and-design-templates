import { DataTypes, Model, Sequelize } from "sequelize";

export interface ReviewAttributes {
  id?: number;
  rating: number;
  comment: string;
  userId: number;
  courseId: number;
}

export class Review
  extends Model<ReviewAttributes>
  implements ReviewAttributes
{
  declare id: number;
  declare rating: number;
  declare comment: string;
  declare userId: number;
  declare courseId: number;

  static initModel(sequelize: Sequelize): typeof Review {
    Review.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 1, max: 5 },
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "user_id",
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "course_id",
        },
      },
      {
        sequelize,
        tableName: "reviews",
        timestamps: false,
      }
    );
    return Review;
  }
}
