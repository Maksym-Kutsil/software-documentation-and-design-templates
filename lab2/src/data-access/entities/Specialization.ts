import { DataTypes, Model, Sequelize } from "sequelize";

export interface SpecializationAttributes {
  id?: number;
  name: string;
  description: string;
}

export class Specialization
  extends Model<SpecializationAttributes>
  implements SpecializationAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;

  static initModel(sequelize: Sequelize): typeof Specialization {
    Specialization.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "specializations",
        timestamps: false,
      }
    );
    return Specialization;
  }
}
