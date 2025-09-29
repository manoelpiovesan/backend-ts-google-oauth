import {Table, Column, DataType, HasMany} from 'sequelize-typescript';
import {CreationOptional, InferAttributes, NonAttribute} from 'sequelize';
import {AbstractModel} from "./AbstractModel";


@Table({tableName: 'users'})
export class User extends AbstractModel<User> {

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare google_profile_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare picture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare role?: CreationOptional<string>;


  toJSON(): APIUser {
    const values: InferAttributes<User> = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    return values as APIUser;
  }

  ////////////////////// Relations //////////////////////
}


export type APIUserCreate = {
  google_profile_id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
}

export type APIUser = APIUserCreate & {
  id: string;
}


