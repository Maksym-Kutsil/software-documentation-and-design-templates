export interface IRepository<TEntity, TCreate = Partial<TEntity>> {
  findAll(): Promise<TEntity[]>;
  findById(id: number): Promise<TEntity | null>;
  create(data: TCreate): Promise<TEntity>;
  update(id: number, data: Partial<TCreate>): Promise<TEntity | null>;
  delete(id: number): Promise<boolean>;
}
