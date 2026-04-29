export interface IImportPresenter {
  displayImportStart(filePath: string): void;
  displayImportProgress(message: string): void;
  displayImportComplete(stats: Record<string, number>): void;
  displayImportError(error: string): void;
}
