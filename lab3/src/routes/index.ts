import { Router } from "express";
import { HomeController } from "../controllers/HomeController";
import { CoursesController } from "../controllers/CoursesController";

export function buildRouter(
  homeController: HomeController,
  coursesController: CoursesController
): Router {
  const router = Router();

  router.get("/", homeController.index.bind(homeController));

  router.get("/courses", coursesController.index);
  router.get("/courses/create", coursesController.createForm);
  router.post("/courses/create", coursesController.create);
  router.get("/courses/:id", coursesController.details);
  router.get("/courses/:id/edit", coursesController.editForm);
  router.post("/courses/:id/edit", coursesController.update);
  router.get("/courses/:id/delete", coursesController.deleteForm);
  router.post("/courses/:id/delete", coursesController.delete);

  return router;
}
