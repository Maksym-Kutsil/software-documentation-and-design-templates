import { DataTypes, Model, Sequelize } from "sequelize";

export interface UserSpecializationAttributes {
  id?: number;
  userId: number;
  specializationId: number;
}

export class UserSpecialization
  extends Model<UserSpecializationAttributes>
  implements UserSpecializationAttributes
{
  declare id: number;
  declare userId: number;
  declare specializationId: number;

  static initModel(sequelize: Sequelize): typeof UserSpecialization {
    UserSpecialization.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "user_id",
        },
        specializationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "specialization_id",
        },
      },
      {
        sequelize,
        tableName: "user_specializations",
        timestamps: false,
      }
    );
    return UserSpecialization;
  }
}
