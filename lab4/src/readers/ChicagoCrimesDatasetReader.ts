import * as fs from "node:fs/promises";
import * as path from "node:path";
import { CrimeRecord } from "../types/CrimeRecord";

interface RawCrimeRecord {
  id?: string;
  case_number?: string;
  date?: string;
  block?: string;
  primary_type?: string;
  description?: string;
  arrest?: boolean | string;
  domestic?: boolean | string;
}

export class ChicagoCrimesDatasetReader {
  async downloadToFile(sourceUrl: string, outputFile: string): Promise<void> {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Cannot download dataset: ${response.status} ${response.statusText}`);
    }

    const payload = await response.text();
    const absolutePath = path.resolve(outputFile);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, payload, "utf-8");
  }

  async readFromFile(inputFile: string): Promise<CrimeRecord[]> {
    const absolutePath = path.resolve(inputFile);
    const content = await fs.readFile(absolutePath, "utf-8");
    const rows = JSON.parse(content) as RawCrimeRecord[];

    return rows.map((row) => ({
      id: row.id ?? "",
      caseNumber: row.case_number ?? "",
      date: row.date ?? "",
      block: row.block ?? "",
      primaryType: row.primary_type ?? "",
      description: row.description ?? "",
      arrest: this.toBoolean(row.arrest),
      domestic: this.toBoolean(row.domestic),
    }));
  }

  private toBoolean(value: boolean | string | undefined): boolean {
    if (typeof value === "boolean") {
      return value;
    }
    return String(value).toLowerCase() === "true";
  }
}
