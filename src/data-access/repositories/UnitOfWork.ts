import { Sequelize, Transaction } from "sequelize";
import { IUnitOfWork } from "../interfaces/IUnitOfWork";
import { IRepository } from "../interfaces/IRepository";
import { Repository } from "./Repository";
import {
  User,
  UserAttributes,
  Specialization,
  SpecializationAttributes,
  Course,
  CourseAttributes,
  Instructor,
  InstructorAttributes,
  Week,
  WeekAttributes,
  Review,
  ReviewAttributes,
  UserSpecialization,
  UserSpecializationAttributes,
} from "../entities";

export class UnitOfWork implements IUnitOfWork {
  private sequelize: Sequelize;
  private transaction: Transaction | null = null;

  public users: IRepository<UserAttributes>;
  public specializations: IRepository<SpecializationAttributes>;
  public courses: IRepository<CourseAttributes>;
  public instructors: IRepository<InstructorAttributes>;
  public weeks: IRepository<WeekAttributes>;
  public reviews: IRepository<ReviewAttributes>;
  public userSpecializations: IRepository<UserSpecializationAttributes>;

  constructor(databasePath: string) {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: databasePath,
      logging: false,
    });

    this.users = new Repository<UserAttributes>(User);
    this.specializations = new Repository<SpecializationAttributes>(
      Specialization
    );
    this.courses = new Repository<CourseAttributes>(Course);
    this.instructors = new Repository<InstructorAttributes>(Instructor);
    this.weeks = new Repository<WeekAttributes>(Week);
    this.reviews = new Repository<ReviewAttributes>(Review);
    this.userSpecializations =
      new Repository<UserSpecializationAttributes>(UserSpecialization);
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
    this.initModels();
    this.setupAssociations();
  }

  private initModels(): void {
    User.initModel(this.sequelize);
    Specialization.initModel(this.sequelize);
    Instructor.initModel(this.sequelize);
    Course.initModel(this.sequelize);
    Week.initModel(this.sequelize);
    Review.initModel(this.sequelize);
    UserSpecialization.initModel(this.sequelize);
  }

  private setupAssociations(): void {
    User.belongsToMany(Specialization, {
      through: UserSpecialization,
      foreignKey: "user_id",
      otherKey: "specialization_id",
    });
    Specialization.belongsToMany(User, {
      through: UserSpecialization,
      foreignKey: "specialization_id",
      otherKey: "user_id",
    });

    Specialization.hasMany(Course, {
      foreignKey: "specialization_id",
    });
    Course.belongsTo(Specialization, {
      foreignKey: "specialization_id",
    });

    Instructor.hasMany(Course, {
      foreignKey: "instructor_id",
    });
    Course.belongsTo(Instructor, {
      foreignKey: "instructor_id",
    });

    Course.hasMany(Week, {
      foreignKey: "course_id",
    });
    Week.belongsTo(Course, {
      foreignKey: "course_id",
    });

    User.hasMany(Review, {
      foreignKey: "user_id",
    });
    Review.belongsTo(User, {
      foreignKey: "user_id",
    });

    Course.hasMany(Review, {
      foreignKey: "course_id",
    });
    Review.belongsTo(Course, {
      foreignKey: "course_id",
    });
  }

  async syncDatabase(): Promise<void> {
    await this.sequelize.sync({ force: true });
  }

  async beginTransaction(): Promise<void> {
    this.transaction = await this.sequelize.transaction();
  }

  async commitTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.commit();
      this.transaction = null;
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = null;
    }
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
