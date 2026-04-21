export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  createBulk(entities: Partial<T>[]): Promise<T[]>;
  update(id: number, entity: Partial<T>): Promise<void>;
  delete(id: number): Promise<void>;
}
