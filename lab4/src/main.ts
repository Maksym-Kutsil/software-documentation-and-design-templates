import { loadConfig } from "./config/AppConfig";
import { ChicagoCrimesDatasetReader } from "./readers/ChicagoCrimesDatasetReader";
import { CrimeExportService } from "./services/CrimeExportService";
import { OutputStrategyFactory } from "./strategies/OutputStrategyFactory";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "config/appsettings.json";
  const config = loadConfig(configPath);

  console.log("=== Lab 4: GoF Strategy Pattern ===");
  console.log(`Configured output: ${config.output.type}`);

  const reader = new ChicagoCrimesDatasetReader();
  const strategy = OutputStrategyFactory.create(config);
  const exportService = new CrimeExportService(reader, strategy, config);

  await exportService.run();
  console.log("Done.");
}

main().catch((error: unknown) => {
  console.error("Application error:", error);
  process.exit(1);
});
