import { Sequelize } from "sequelize";
import { IUnitOfWork } from "../interfaces/IUnitOfWork";
import { IRepository } from "../interfaces/IRepository";
import { ICourseRepository } from "../interfaces/ICourseRepository";
import {
  Course,
  Specialization,
  Instructor,
  SpecializationAttributes,
  InstructorAttributes,
} from "../entities";
import { Repository } from "./Repository";
import { CourseRepository } from "./CourseRepository";

export class UnitOfWork implements IUnitOfWork {
  private sequelize: Sequelize;

  public courses!: ICourseRepository;
  public specializations!: IRepository<SpecializationAttributes>;
  public instructors!: IRepository<InstructorAttributes>;

  constructor(databasePath: string) {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: databasePath,
      logging: false,
    });
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
    this.initModels();
    this.setupAssociations();
    this.initRepositories();
  }

  private initModels(): void {
    Specialization.initModel(this.sequelize);
    Instructor.initModel(this.sequelize);
    Course.initModel(this.sequelize);
  }

  private setupAssociations(): void {
    Course.belongsTo(Specialization, {
      foreignKey: "specializationId",
      as: "specialization",
    });
    Specialization.hasMany(Course, {
      foreignKey: "specializationId",
      as: "courses",
    });

    Course.belongsTo(Instructor, {
      foreignKey: "instructorId",
      as: "instructor",
    });
    Instructor.hasMany(Course, {
      foreignKey: "instructorId",
      as: "courses",
    });
  }

  private initRepositories(): void {
    this.courses = new CourseRepository();
    this.specializations = new Repository<SpecializationAttributes, Specialization>(
      Specialization
    );
    this.instructors = new Repository<InstructorAttributes, Instructor>(Instructor);
  }

  async syncDatabase(force: boolean = false): Promise<void> {
    await this.sequelize.sync({ force });
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
