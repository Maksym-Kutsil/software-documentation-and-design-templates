import {
  CourseViewModel,
  CreateCourseDto,
  UpdateCourseDto,
  SpecializationViewModel,
  InstructorViewModel,
} from "../dto/CourseDto";

export interface ICourseService {
  getAll(): Promise<CourseViewModel[]>;
  getById(id: number): Promise<CourseViewModel | null>;
  create(dto: CreateCourseDto): Promise<CourseViewModel>;
  update(id: number, dto: UpdateCourseDto): Promise<CourseViewModel | null>;
  delete(id: number): Promise<boolean>;
  getSpecializations(): Promise<SpecializationViewModel[]>;
  getInstructors(): Promise<InstructorViewModel[]>;
}
