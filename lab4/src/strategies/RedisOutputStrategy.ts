import { createClient } from "redis";
import { IOutputStrategy } from "./IOutputStrategy";

export class RedisOutputStrategy implements IOutputStrategy {
  constructor(
    private readonly redisUrl: string,
    private readonly listKey: string
  ) {}

  async write(lines: string[]): Promise<void> {
    const client = createClient({ url: this.redisUrl });
    await client.connect();

    try {
      if (lines.length > 0) {
        await client.rPush(this.listKey, lines);
      }
    } finally {
      await client.disconnect();
    }
  }
}
