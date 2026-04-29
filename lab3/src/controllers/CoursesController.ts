import { Request, Response } from "express";
import { ICourseService } from "../business-logic/interfaces";
import { ValidationError } from "../business-logic/services/CourseService";
import {
  CreateCourseDto,
  UpdateCourseDto,
} from "../business-logic/dto/CourseDto";

export class CoursesController {
  constructor(private courseService: ICourseService) {}

  index = async (_req: Request, res: Response): Promise<void> => {
    const courses = await this.courseService.getAll();
    res.render("courses/index", { title: "Courses", courses });
  };

  details = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const course = await this.courseService.getById(id);
    if (!course) {
      res.status(404).render("error", {
        title: "Not Found",
        message: `Course #${id} not found`,
      });
      return;
    }
    res.render("courses/details", { title: course.name, course });
  };

  createForm = async (_req: Request, res: Response): Promise<void> => {
    const [specializations, instructors] = await Promise.all([
      this.courseService.getSpecializations(),
      this.courseService.getInstructors(),
    ]);
    res.render("courses/create", {
      title: "New Course",
      specializations,
      instructors,
      errors: [],
      values: {},
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = this.parseCreateDto(req.body);
    try {
      const created = await this.courseService.create(dto);
      res.redirect(`/courses/${created.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const [specializations, instructors] = await Promise.all([
          this.courseService.getSpecializations(),
          this.courseService.getInstructors(),
        ]);
        res.status(400).render("courses/create", {
          title: "New Course",
          specializations,
          instructors,
          errors: err.errors,
          values: req.body,
        });
        return;
      }
      throw err;
    }
  };

  editForm = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const course = await this.courseService.getById(id);
    if (!course) {
      res.status(404).render("error", {
        title: "Not Found",
        message: `Course #${id} not found`,
      });
      return;
    }
    const [specializations, instructors] = await Promise.all([
      this.courseService.getSpecializations(),
      this.courseService.getInstructors(),
    ]);
    res.render("courses/edit", {
      title: `Edit ${course.name}`,
      course,
      specializations,
      instructors,
      errors: [],
      values: course,
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const dto = this.parseUpdateDto(req.body);
    try {
      const updated = await this.courseService.update(id, dto);
      if (!updated) {
        res.status(404).render("error", {
          title: "Not Found",
          message: `Course #${id} not found`,
        });
        return;
      }
      res.redirect(`/courses/${updated.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const course = await this.courseService.getById(id);
        const [specializations, instructors] = await Promise.all([
          this.courseService.getSpecializations(),
          this.courseService.getInstructors(),
        ]);
        res.status(400).render("courses/edit", {
          title: `Edit Course #${id}`,
          course,
          specializations,
          instructors,
          errors: err.errors,
          values: { ...course, ...req.body },
        });
        return;
      }
      throw err;
    }
  };

  deleteForm = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const course = await this.courseService.getById(id);
    if (!course) {
      res.status(404).render("error", {
        title: "Not Found",
        message: `Course #${id} not found`,
      });
      return;
    }
    res.render("courses/delete", { title: "Delete Course", course });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    await this.courseService.delete(id);
    res.redirect("/courses");
  };

  private parseCreateDto(body: any): CreateCourseDto {
    return {
      name: String(body.name ?? "").trim(),
      description: String(body.description ?? "").trim(),
      durationWeeks: Number(body.durationWeeks),
      specializationId: Number(body.specializationId),
      instructorId: Number(body.instructorId),
    };
  }

  private parseUpdateDto(body: any): UpdateCourseDto {
    const dto: UpdateCourseDto = {};
    if (body.name !== undefined) dto.name = String(body.name).trim();
    if (body.description !== undefined)
      dto.description = String(body.description).trim();
    if (body.durationWeeks !== undefined)
      dto.durationWeeks = Number(body.durationWeeks);
    if (body.specializationId !== undefined)
      dto.specializationId = Number(body.specializationId);
    if (body.instructorId !== undefined)
      dto.instructorId = Number(body.instructorId);
    return dto;
  }
}
