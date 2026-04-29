import { AppConfig } from "../config/AppConfig";
import { ConsoleOutputStrategy } from "./ConsoleOutputStrategy";
import { IOutputStrategy } from "./IOutputStrategy";
import { KafkaOutputStrategy } from "./KafkaOutputStrategy";
import { RedisOutputStrategy } from "./RedisOutputStrategy";

export class OutputStrategyFactory {
  static create(config: AppConfig): IOutputStrategy {
    if (config.output.type === "console") {
      return new ConsoleOutputStrategy();
    }

    if (config.output.type === "kafka") {
      return new KafkaOutputStrategy(
        config.kafka.brokers,
        config.kafka.topic,
        config.kafka.clientId
      );
    }

    if (config.output.type === "redis") {
      return new RedisOutputStrategy(config.redis.url, config.redis.listKey);
    }

    throw new Error(`Unsupported output type: ${String(config.output.type)}`);
  }
}
