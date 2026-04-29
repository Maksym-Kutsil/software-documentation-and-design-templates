import { Repository } from "./Repository";
import { Course, CourseAttributes, Specialization, Instructor } from "../entities";
import {
  ICourseRepository,
  CourseWithRelations,
} from "../interfaces/ICourseRepository";

export class CourseRepository
  extends Repository<CourseAttributes, Course>
  implements ICourseRepository
{
  constructor() {
    super(Course);
  }

  async findAllWithRelations(): Promise<CourseWithRelations[]> {
    const records = await Course.findAll({
      include: [
        { model: Specialization, as: "specialization" },
        { model: Instructor, as: "instructor" },
      ],
      order: [["id", "ASC"]],
    });
    return records.map((r) => {
      const plain = r.toJSON() as any;
      return {
        ...plain,
        specializationName: plain.specialization?.name,
        instructorName: plain.instructor?.name,
      };
    });
  }

  async findByIdWithRelations(id: number): Promise<CourseWithRelations | null> {
    const record = await Course.findByPk(id, {
      include: [
        { model: Specialization, as: "specialization" },
        { model: Instructor, as: "instructor" },
      ],
    });
    if (!record) return null;
    const plain = record.toJSON() as any;
    return {
      ...plain,
      specializationName: plain.specialization?.name,
      instructorName: plain.instructor?.name,
    };
  }
}
