import { Kafka } from "kafkajs";
import { IOutputStrategy } from "./IOutputStrategy";

export class KafkaOutputStrategy implements IOutputStrategy {
  constructor(
    private readonly brokers: string[],
    private readonly topic: string,
    private readonly clientId: string
  ) {}

  async write(lines: string[]): Promise<void> {
    const kafka = new Kafka({
      brokers: this.brokers,
      clientId: this.clientId,
    });
    const producer = kafka.producer();

    await producer.connect();
    try {
      for (let attempt = 1; attempt <= 5; attempt += 1) {
        try {
          await producer.send({
            topic: this.topic,
            messages: lines.map((line) => ({ value: line })),
          });
          return;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          const isMetadataRace = message.includes(
            "This server does not host this topic-partition"
          );

          if (!isMetadataRace || attempt === 5) {
            throw error;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } finally {
      await producer.disconnect();
    }
  }
}
