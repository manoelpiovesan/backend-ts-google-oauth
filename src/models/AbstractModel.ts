import {CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";
import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table({modelName: 'AbstractModel', paranoid: false})
export abstract class AbstractModel<T extends Model> extends Model<InferAttributes<T>, InferCreationAttributes<T>> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: CreationOptional<string>;
}