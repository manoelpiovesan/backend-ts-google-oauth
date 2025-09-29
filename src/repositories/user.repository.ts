import {User} from "../models/User";
import {InferAttributes} from "sequelize";
import {UserCreationAttributes} from "../config/passport";

class UserRepository {

  /**
   * User from JWT payload
   */
  static async getUserFromRequest(request: Express.Request): Promise<User | null> {
    const jwt_user = request.jwt_user;
    if (!jwt_user) {
      return null;
    }
    return await User.findOne({where: {google_profile_id: jwt_user.google_profile_id}});
  }

  /**
   * Creates a new user if one with the given email does not already exist.
   */
  static async createIfNotExists(userData: UserCreationAttributes): Promise<InferAttributes<User>> {

    let user = await User.findOne({where: {email: userData.email}});

    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.name = userData.name;
    newUser.email = userData.email;
    newUser.picture = userData.picture;
    newUser.google_profile_id = userData.google_profile_id;
    newUser.role = 'user';

    // If this is the first user, make them an admin
    if(await User.count() === 0) {
      newUser.role = 'admin';
      console.log('[INFO] First user created, assigning admin role:', newUser.email);
    }

    return await newUser.save();
  }

}

export const userService = new UserRepository();
export { UserRepository };