import * as fs from "node:fs";
import * as path from "node:path";

export type OutputType = "console" | "kafka" | "redis";

export interface AppConfig {
  dataset: {
    sourceUrl: string;
    outputFile: string;
    limit: number;
  };
  output: {
    type: OutputType;
  };
  kafka: {
    brokers: string[];
    topic: string;
    clientId: string;
  };
  redis: {
    url: string;
    listKey: string;
  };
}

export function loadConfig(configPath: string): AppConfig {
  const absolutePath = path.resolve(configPath);
  const content = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(content) as AppConfig;
}
