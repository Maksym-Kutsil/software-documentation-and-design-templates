import { IRepository } from "./IRepository";
import { CourseAttributes } from "../entities";

export interface CourseWithRelations extends CourseAttributes {
  specializationName?: string;
  instructorName?: string;
}

export interface ICourseRepository
  extends IRepository<CourseAttributes, Omit<CourseAttributes, "id">> {
  findAllWithRelations(): Promise<CourseWithRelations[]>;
  findByIdWithRelations(id: number): Promise<CourseWithRelations | null>;
}
