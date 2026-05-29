import {APIUser, APIUserCreate, User} from "../models/user";
import {DefaultSearchParams} from "../types/api_common_types";
import {Op} from "sequelize";

export class UserRepository {

  /**
   * Get All users with pagination and optional search by name. For admin users only.
   * @param params
   */
  static async findAll(params: DefaultSearchParams): Promise<APIUser[]> {
    return await User.findAll(
      {
        where: params.search ? {
          name: {
            [Op.iLike]: `%${params.search}%`
          },
        } : {},
        limit: params.size && params.size > 0 ? params.size : 10,
        offset: params.page && params.page > 0 ? (params.page - 1) *
          (params.size && params.size > 0 ? params.size : 10) : 0,
        order: [['id', 'ASC']],
      }
    );
  }

  /**
   * Creates a new user if one with the given email does not already exist.
   * @param data
   */
  static async createIfNotExists(data: APIUserCreate): Promise<APIUser> {

    let user = await User.findOne({where: {google_profile_id: data.google_profile_id}});

    if (user) {
      return user;
    }

    const is_first_user = await User.count() === 0;

    // If this is the first user, make them an admin
    if (is_first_user) {
      console.log('[INFO] First user created. Granting admin role.');
    }

    return await User.create({...data, role: is_first_user ? 'admin' : 'user'});
  }


}

