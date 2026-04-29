import { Model, ModelStatic } from "sequelize";
import { IRepository } from "../interfaces/IRepository";

export class Repository<T extends Record<string, any>>
  implements IRepository<T>
{
  constructor(private model: ModelStatic<Model<T>>) {}

  async findAll(): Promise<T[]> {
    const results = await this.model.findAll();
    return results.map((r) => r.get({ plain: true }) as T);
  }

  async findById(id: number): Promise<T | null> {
    const result = await this.model.findByPk(id);
    return result ? (result.get({ plain: true }) as T) : null;
  }

  async create(entity: Partial<T>): Promise<T> {
    const result = await this.model.create(entity as any);
    return result.get({ plain: true }) as T;
  }

  async createBulk(entities: Partial<T>[]): Promise<T[]> {
    const results = await this.model.bulkCreate(entities as any[]);
    return results.map((r) => r.get({ plain: true }) as T);
  }

  async update(id: number, entity: Partial<T>): Promise<void> {
    await this.model.update(entity as any, { where: { id } as any });
  }

  async delete(id: number): Promise<void> {
    await this.model.destroy({ where: { id } as any });
  }
}
