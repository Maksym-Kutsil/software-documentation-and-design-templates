export interface CsvRow {
  userName: string;
  userEmail: string;
  specializationName: string;
  specializationDescription: string;
  courseName: string;
  instructorName: string;
  weekNumber: number;
  weekDeadline: string;
  reviewRating: number;
  reviewComment: string;
}

export interface ICsvDataReader {
  readCsv(filePath: string): Promise<CsvRow[]>;
}
