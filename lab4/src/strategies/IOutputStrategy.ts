export interface IOutputStrategy {
  write(lines: string[]): Promise<void>;
}
