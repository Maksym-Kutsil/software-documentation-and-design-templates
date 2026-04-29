import { IOutputStrategy } from "./IOutputStrategy";

export class ConsoleOutputStrategy implements IOutputStrategy {
  async write(lines: string[]): Promise<void> {
    lines.forEach((line) => console.log(line));
  }
}
