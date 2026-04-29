import { IDataImportService } from "../interfaces/IDataImportService";
import { ICsvDataReader, CsvRow } from "../../data-access/interfaces";
import { IUnitOfWork } from "../../data-access/interfaces";

export class DataImportService implements IDataImportService {
  private csvDataReader: ICsvDataReader;
  private unitOfWork: IUnitOfWork;

  constructor(csvDataReader: ICsvDataReader, unitOfWork: IUnitOfWork) {
    this.csvDataReader = csvDataReader;
    this.unitOfWork = unitOfWork;
  }

  async importFromCsv(csvFilePath: string): Promise<void> {
    console.log(`Reading CSV file: ${csvFilePath}`);
    const rows = await this.csvDataReader.readCsv(csvFilePath);
    console.log(`Read ${rows.length} rows from CSV`);

    await this.unitOfWork.syncDatabase();
    console.log("Database schema synchronized");

    const instructorMap = new Map<string, number>();
    const specializationMap = new Map<string, number>();
    const userMap = new Map<string, number>();
    const courseMap = new Map<string, number>();
    const weekSet = new Set<string>();
    const enrollmentSet = new Set<string>();
    const reviewSet = new Set<string>();

    const uniqueInstructors = this.getUniqueValues(rows, (r) => r.instructorName);
    const uniqueSpecializations = this.getUniqueSpecializations(rows);
    const uniqueUsers = this.getUniqueUsers(rows);

    console.log("Importing instructors...");
    for (const name of uniqueInstructors) {
      const instructor = await this.unitOfWork.instructors.create({ name });
      instructorMap.set(name, instructor.id!);
    }
    console.log(`  Imported ${instructorMap.size} instructors`);

    console.log("Importing specializations...");
    for (const [name, description] of uniqueSpecializations) {
      const spec = await this.unitOfWork.specializations.create({
        name,
        description,
      });
      specializationMap.set(name, spec.id!);
    }
    console.log(`  Imported ${specializationMap.size} specializations`);

    console.log("Importing users...");
    for (const [email, name] of uniqueUsers) {
      const user = await this.unitOfWork.users.create({ name, email });
      userMap.set(email, user.id!);
    }
    console.log(`  Imported ${userMap.size} users`);

    console.log("Importing courses, weeks, enrollments, and reviews...");
    let courseCount = 0;
    let weekCount = 0;
    let enrollmentCount = 0;
    let reviewCount = 0;

    for (const row of rows) {
      const instructorId = instructorMap.get(row.instructorName)!;
      const specializationId = specializationMap.get(row.specializationName)!;
      const userId = userMap.get(row.userEmail)!;

      const courseKey = `${row.courseName}|${specializationId}`;
      if (!courseMap.has(courseKey)) {
        const course = await this.unitOfWork.courses.create({
          name: row.courseName,
          specializationId,
          instructorId,
        });
        courseMap.set(courseKey, course.id!);
        courseCount++;
      }
      const courseId = courseMap.get(courseKey)!;

      const weekKey = `${courseId}|${row.weekNumber}`;
      if (!weekSet.has(weekKey)) {
        await this.unitOfWork.weeks.create({
          number: row.weekNumber,
          deadline: row.weekDeadline,
          courseId,
        });
        weekSet.add(weekKey);
        weekCount++;
      }

      const enrollmentKey = `${userId}|${specializationId}`;
      if (!enrollmentSet.has(enrollmentKey)) {
        await this.unitOfWork.userSpecializations.create({
          userId,
          specializationId,
        });
        enrollmentSet.add(enrollmentKey);
        enrollmentCount++;
      }

      const reviewKey = `${userId}|${courseId}|${row.reviewComment}`;
      if (!reviewSet.has(reviewKey)) {
        await this.unitOfWork.reviews.create({
          rating: row.reviewRating,
          comment: row.reviewComment,
          userId,
          courseId,
        });
        reviewSet.add(reviewKey);
        reviewCount++;
      }
    }

    console.log(`  Imported ${courseCount} courses`);
    console.log(`  Imported ${weekCount} weeks`);
    console.log(`  Imported ${enrollmentCount} enrollments`);
    console.log(`  Imported ${reviewCount} reviews`);
    console.log("Import completed successfully!");
  }

  private getUniqueValues(rows: CsvRow[], selector: (r: CsvRow) => string): string[] {
    return [...new Set(rows.map(selector))];
  }

  private getUniqueSpecializations(rows: CsvRow[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const row of rows) {
      if (!map.has(row.specializationName)) {
        map.set(row.specializationName, row.specializationDescription);
      }
    }
    return map;
  }

  private getUniqueUsers(rows: CsvRow[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const row of rows) {
      if (!map.has(row.userEmail)) {
        map.set(row.userEmail, row.userName);
      }
    }
    return map;
  }
}
