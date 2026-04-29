import { IUnitOfWork } from "./data-access/interfaces";
import { UnitOfWork } from "./data-access/repositories/UnitOfWork";
import { ICourseService } from "./business-logic/interfaces";
import { CourseService } from "./business-logic/services/CourseService";
import { HomeController } from "./controllers/HomeController";
import { CoursesController } from "./controllers/CoursesController";

export class DiContainer {
  private instances = new Map<string, unknown>();

  constructor(private databasePath: string) {}

  private getOrCreate<T>(key: string, factory: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory());
    }
    return this.instances.get(key) as T;
  }

  resolveUnitOfWork(): IUnitOfWork {
    return this.getOrCreate<IUnitOfWork>(
      "IUnitOfWork",
      () => new UnitOfWork(this.databasePath)
    );
  }

  resolveCourseService(): ICourseService {
    return this.getOrCreate<ICourseService>(
      "ICourseService",
      () => new CourseService(this.resolveUnitOfWork())
    );
  }

  resolveHomeController(): HomeController {
    return this.getOrCreate("HomeController", () => new HomeController());
  }

  resolveCoursesController(): CoursesController {
    return this.getOrCreate(
      "CoursesController",
      () => new CoursesController(this.resolveCourseService())
    );
  }
}
