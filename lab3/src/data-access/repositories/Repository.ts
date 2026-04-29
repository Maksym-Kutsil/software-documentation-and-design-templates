import { Model, ModelStatic } from "sequelize";
import { IRepository } from "../interfaces/IRepository";

export class Repository<
  TAttributes extends { id?: number },
  TModel extends Model<TAttributes> = Model<TAttributes>
> implements IRepository<TAttributes, Omit<TAttributes, "id">>
{
  constructor(protected model: ModelStatic<TModel>) {}

  async findAll(): Promise<TAttributes[]> {
    const records = await this.model.findAll();
    return records.map((r) => r.toJSON() as TAttributes);
  }

  async findById(id: number): Promise<TAttributes | null> {
    const record = await this.model.findByPk(id);
    return record ? (record.toJSON() as TAttributes) : null;
  }

  async create(data: Omit<TAttributes, "id">): Promise<TAttributes> {
    const record = await this.model.create(data as any);
    return record.toJSON() as TAttributes;
  }

  async update(
    id: number,
    data: Partial<Omit<TAttributes, "id">>
  ): Promise<TAttributes | null> {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record.toJSON() as TAttributes;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.model.destroy({ where: { id } as any });
    return deleted > 0;
  }
}
