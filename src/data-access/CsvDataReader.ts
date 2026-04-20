import * as fs from "fs";
import * as path from "path";
import { ICsvDataReader, CsvRow } from "./interfaces/ICsvDataReader";

export class CsvDataReader implements ICsvDataReader {
  async readCsv(filePath: string): Promise<CsvRow[]> {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      return [];
    }

    const headers = this.parseCsvLine(lines[0]);
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      if (values.length !== headers.length) continue;

      rows.push({
        userName: values[0],
        userEmail: values[1],
        specializationName: values[2],
        specializationDescription: values[3],
        courseName: values[4],
        instructorName: values[5],
        weekNumber: parseInt(values[6], 10),
        weekDeadline: values[7],
        reviewRating: parseInt(values[8], 10),
        reviewComment: values[9],
      });
    }

    return rows;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
    }

    result.push(current.trim());
    return result;
  }
}
