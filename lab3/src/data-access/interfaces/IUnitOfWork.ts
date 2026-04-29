import { IRepository } from "./IRepository";
import { ICourseRepository } from "./ICourseRepository";
import {
  CourseAttributes,
  SpecializationAttributes,
  InstructorAttributes,
} from "../entities";

export interface IUnitOfWork {
  courses: ICourseRepository;
  specializations: IRepository<SpecializationAttributes>;
  instructors: IRepository<InstructorAttributes>;
  connect(): Promise<void>;
  syncDatabase(force?: boolean): Promise<void>;
  close(): Promise<void>;
}
