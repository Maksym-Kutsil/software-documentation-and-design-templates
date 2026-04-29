import path from "path";
import express, { Request, Response, NextFunction } from "express";
import { DiContainer } from "./di-container";
import { buildRouter } from "./routes";

async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT || 3000);
  const dbPath = path.join(__dirname, "..", "database.sqlite");

  const container = new DiContainer(dbPath);
  const uow = container.resolveUnitOfWork();
  await uow.connect();
  await uow.syncDatabase(false);

  const app = express();

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  const router = buildRouter(
    container.resolveHomeController(),
    container.resolveCoursesController()
  );
  app.use("/", router);

  app.use((req: Request, res: Response) => {
    res.status(404).render("error", {
      title: "Not Found",
      message: `Route ${req.method} ${req.url} not found`,
    });
  });

  app.use(
    (err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      res.status(500).render("error", {
        title: "Server Error",
        message: err.message,
      });
    }
  );

  app.listen(port, () => {
    console.log(`Lab 3 server running on http://localhost:${port}`);
    console.log(`   Database: ${dbPath}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
