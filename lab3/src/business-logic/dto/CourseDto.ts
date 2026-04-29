export interface CourseViewModel {
  id: number;
  name: string;
  description: string;
  durationWeeks: number;
  specializationId: number;
  instructorId: number;
  specializationName?: string;
  instructorName?: string;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  durationWeeks: number;
  specializationId: number;
  instructorId: number;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface SpecializationViewModel {
  id: number;
  name: string;
}

export interface InstructorViewModel {
  id: number;
  name: string;
}
