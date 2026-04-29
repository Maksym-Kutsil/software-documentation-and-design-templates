import { AppConfig } from "../config/AppConfig";
import { ChicagoCrimesDatasetReader } from "../readers/ChicagoCrimesDatasetReader";
import { IOutputStrategy } from "../strategies/IOutputStrategy";
import { CrimeRecord } from "../types/CrimeRecord";

export class CrimeExportService {
  constructor(
    private readonly reader: ChicagoCrimesDatasetReader,
    private readonly strategy: IOutputStrategy,
    private readonly config: AppConfig
  ) {}

  async run(): Promise<void> {
    const sourceUrl = `${this.config.dataset.sourceUrl}?$limit=${this.config.dataset.limit}`;
    await this.reader.downloadToFile(sourceUrl, this.config.dataset.outputFile);

    const records = await this.reader.readFromFile(this.config.dataset.outputFile);
    const lines = records.map((record) => this.formatRecord(record));
    await this.strategy.write(lines);
  }

  private formatRecord(record: CrimeRecord): string {
    return JSON.stringify(record);
  }
}
