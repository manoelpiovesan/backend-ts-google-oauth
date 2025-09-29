import {Controller} from "tsoa";
import {Model} from "sequelize-typescript";

export abstract class AbstractController<T extends Model> extends Controller {
  abstract getAll(request: Express.Request, page: number, size: number, search: string): Promise<Object[]>;

  abstract getById(request: Express.Request, id: number): Promise<Object | null>;

  abstract create(request: Express.Request, body: Object): Promise<Object>;

  abstract delete(request: Express.Request, id: number): Promise<void>;
}