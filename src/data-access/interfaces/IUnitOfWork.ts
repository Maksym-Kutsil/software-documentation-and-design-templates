import { IRepository } from "./IRepository";
import {
  UserAttributes,
  SpecializationAttributes,
  CourseAttributes,
  InstructorAttributes,
  WeekAttributes,
  ReviewAttributes,
  UserSpecializationAttributes,
} from "../entities";

export interface IUnitOfWork {
  users: IRepository<UserAttributes>;
  specializations: IRepository<SpecializationAttributes>;
  courses: IRepository<CourseAttributes>;
  instructors: IRepository<InstructorAttributes>;
  weeks: IRepository<WeekAttributes>;
  reviews: IRepository<ReviewAttributes>;
  userSpecializations: IRepository<UserSpecializationAttributes>;

  connect(): Promise<void>;
  syncDatabase(): Promise<void>;
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  close(): Promise<void>;
}
