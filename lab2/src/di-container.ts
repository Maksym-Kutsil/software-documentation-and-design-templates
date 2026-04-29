import { ICsvDataReader } from "./data-access/interfaces";
import { IUnitOfWork } from "./data-access/interfaces";
import { IDataImportService } from "./business-logic/interfaces";
import { CsvDataReader } from "./data-access/CsvDataReader";
import { UnitOfWork } from "./data-access/repositories/UnitOfWork";
import { DataImportService } from "./business-logic/services/DataImportService";

/**
 * IoC container — resolves and wires dependencies across all layers.
 * BLL depends on DAL interfaces (not implementations).
 */
export class DiContainer {
  private instances = new Map<string, any>();

  constructor(private databasePath: string) {}

  private getOrCreate<T>(key: string, factory: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory());
    }
    return this.instances.get(key) as T;
  }

  resolveCsvDataReader(): ICsvDataReader {
    return this.getOrCreate<ICsvDataReader>(
      "ICsvDataReader",
      () => new CsvDataReader()
    );
  }

  resolveUnitOfWork(): IUnitOfWork {
    return this.getOrCreate<IUnitOfWork>(
      "IUnitOfWork",
      () => new UnitOfWork(this.databasePath)
    );
  }

  resolveDataImportService(): IDataImportService {
    return this.getOrCreate<IDataImportService>(
      "IDataImportService",
      () =>
        new DataImportService(
          this.resolveCsvDataReader(),
          this.resolveUnitOfWork()
        )
    );
  }
}
