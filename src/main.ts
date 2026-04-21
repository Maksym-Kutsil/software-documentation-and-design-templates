import * as path from "path";
import { DiContainer } from "./di-container";

async function main(): Promise<void> {
  const csvFilePath =
    process.argv[2] || path.join(__dirname, "..", "data.csv");
  const dbPath =
    process.argv[3] || path.join(__dirname, "..", "database.sqlite");

  console.log("=== Lab 2: Three-Layer Architecture ===\n");
  console.log(`CSV file:  ${path.resolve(csvFilePath)}`);
  console.log(`Database:  ${path.resolve(dbPath)}\n`);

  const container = new DiContainer(dbPath);

  const unitOfWork = container.resolveUnitOfWork();
  await unitOfWork.connect();
  console.log("Database connection established\n");

  const importService = container.resolveDataImportService();
  await importService.importFromCsv(csvFilePath);

  console.log("\n--- Verification ---");
  const users = await unitOfWork.users.findAll();
  const specializations = await unitOfWork.specializations.findAll();
  const courses = await unitOfWork.courses.findAll();
  const instructors = await unitOfWork.instructors.findAll();
  const weeks = await unitOfWork.weeks.findAll();
  const reviews = await unitOfWork.reviews.findAll();

  console.log(`Users in DB:           ${users.length}`);
  console.log(`Specializations in DB: ${specializations.length}`);
  console.log(`Courses in DB:         ${courses.length}`);
  console.log(`Instructors in DB:     ${instructors.length}`);
  console.log(`Weeks in DB:           ${weeks.length}`);
  console.log(`Reviews in DB:         ${reviews.length}`);

  await unitOfWork.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
