import {Get, Query, Request, Route, Security, Tags} from 'tsoa';
import {User} from "../models/User";
import {InferAttributes, Op} from "sequelize";
import {JWTUser} from "../types/declaration";
import {AbstractController} from "./abstract.controller";

@Route('users')
@Tags('Usuários')
export class UserController extends AbstractController<User> {

  /**
   * Get current authenticated user
   * @param request
   */
  @Get('me')
  @Security('google-jwt')
  public async me(
    @Request() request: Express.Request,
  ): Promise<JWTUser> {
    return request.jwt_user!;
  }

  /**
   * Get all users - For admin users only
   * @param request
   * @param page
   * @param size
   * @param search
   */
  @Get()
  @Security('google-jwt', ['admin'])
  public async getAll(
    @Request() request: Express.Request,
    @Query() page?: number,
    @Query() size?: number,
    @Query() search?: string,
  ): Promise<InferAttributes<User>[]> {
    const limit = size && size > 0 ? size : 10;
    const offset = page && page > 0 ? (page - 1) * limit : 0;

    const whereClause = search ? {
      where: {
        name: {
          [Op.iLike]: `%${search}%`
        },
      }
    } : {};
    return await User.findAll({
      ...whereClause,
      limit,
      offset,
      order: [['id', 'ASC']],
    });
  }


  // We won't implement these methods for now, but they are required by the abstract class.
  getById(request: Express.Request, id: number): Promise<InferAttributes<User>> {
    throw new Error('Method not implemented.');
  }

  // Users only created via Google OAuth, so we won't implement this method.
  create(request: Express.Request, body: InferAttributes<any>): Promise<InferAttributes<User>> {
    throw new Error('Method not implemented.');
  }

  // The same.
  delete(request: Express.Request, id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

}
