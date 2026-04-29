export interface IDataImportService {
  importFromCsv(csvFilePath: string): Promise<void>;
}
