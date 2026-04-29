import { IUnitOfWork } from "../../data-access/interfaces";
import { ICourseService } from "../interfaces/ICourseService";
import {
  CourseViewModel,
  CreateCourseDto,
  UpdateCourseDto,
  SpecializationViewModel,
  InstructorViewModel,
} from "../dto/CourseDto";

export class CourseService implements ICourseService {
  constructor(private unitOfWork: IUnitOfWork) {}

  async getAll(): Promise<CourseViewModel[]> {
    const courses = await this.unitOfWork.courses.findAllWithRelations();
    return courses.map((c) => ({
      id: c.id!,
      name: c.name,
      description: c.description,
      durationWeeks: c.durationWeeks,
      specializationId: c.specializationId,
      instructorId: c.instructorId,
      specializationName: c.specializationName,
      instructorName: c.instructorName,
    }));
  }

  async getById(id: number): Promise<CourseViewModel | null> {
    const course = await this.unitOfWork.courses.findByIdWithRelations(id);
    if (!course) return null;
    return {
      id: course.id!,
      name: course.name,
      description: course.description,
      durationWeeks: course.durationWeeks,
      specializationId: course.specializationId,
      instructorId: course.instructorId,
      specializationName: course.specializationName,
      instructorName: course.instructorName,
    };
  }

  async create(dto: CreateCourseDto): Promise<CourseViewModel> {
    this.validate(dto);
    const created = await this.unitOfWork.courses.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
      durationWeeks: dto.durationWeeks,
      specializationId: dto.specializationId,
      instructorId: dto.instructorId,
    });
    const full = await this.unitOfWork.courses.findByIdWithRelations(created.id!);
    return full as CourseViewModel;
  }

  async update(
    id: number,
    dto: UpdateCourseDto
  ): Promise<CourseViewModel | null> {
    this.validate(dto, true);
    const updated = await this.unitOfWork.courses.update(id, dto as any);
    if (!updated) return null;
    const full = await this.unitOfWork.courses.findByIdWithRelations(id);
    return full as CourseViewModel;
  }

  async delete(id: number): Promise<boolean> {
    return this.unitOfWork.courses.delete(id);
  }

  async getSpecializations(): Promise<SpecializationViewModel[]> {
    const all = await this.unitOfWork.specializations.findAll();
    return all.map((s) => ({ id: s.id!, name: s.name }));
  }

  async getInstructors(): Promise<InstructorViewModel[]> {
    const all = await this.unitOfWork.instructors.findAll();
    return all.map((i) => ({ id: i.id!, name: i.name }));
  }

  private validate(dto: Partial<CreateCourseDto>, partial: boolean = false): void {
    const errors: string[] = [];
    if (!partial || dto.name !== undefined) {
      if (!dto.name || dto.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
      }
    }
    if (!partial || dto.description !== undefined) {
      if (!dto.description || dto.description.trim().length < 5) {
        errors.push("Description must be at least 5 characters long");
      }
    }
    if (!partial || dto.durationWeeks !== undefined) {
      if (
        dto.durationWeeks === undefined ||
        !Number.isFinite(dto.durationWeeks) ||
        dto.durationWeeks < 1 ||
        dto.durationWeeks > 52
      ) {
        errors.push("Duration (weeks) must be between 1 and 52");
      }
    }
    if (!partial || dto.specializationId !== undefined) {
      if (!dto.specializationId || dto.specializationId < 1) {
        errors.push("Specialization is required");
      }
    }
    if (!partial || dto.instructorId !== undefined) {
      if (!dto.instructorId || dto.instructorId < 1) {
        errors.push("Instructor is required");
      }
    }
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
}

export class ValidationError extends Error {
  public readonly errors: string[];
  constructor(errors: string[]) {
    super(errors.join("; "));
    this.errors = errors;
    this.name = "ValidationError";
  }
}
