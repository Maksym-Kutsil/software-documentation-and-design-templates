import { Request, Response } from "express";

export class HomeController {
  index(_req: Request, res: Response): void {
    res.render("home", { title: "Lab 3 - Courses MVC" });
  }
}
