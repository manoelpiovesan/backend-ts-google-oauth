import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import {UserRepository} from "../repositories/user.repository";

export type UserCreationAttributes = {
  google_profile_id: string;
  email: string;
  name: string;
  picture?: string;
  role?: 'user' | 'admin';
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const userCreateParams: UserCreationAttributes = {
        google_profile_id: profile.id,
        email: profile.emails?.[0].value || '',
        name: profile.displayName,
        picture: profile.photos?.[0].value,
      }

      let user = await UserRepository.createIfNotExists(userCreateParams);

      const token = jwt.sign({
        id: user.id,
        google_profile_id: user.google_profile_id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      }, process.env.JWT_SECRET!, { expiresIn: '8h' });


      return done(null, { ...userCreateParams, token });
    } catch (err) {
      return done(err, false);
    }
  }
));

export const passportInitialize = passport.initialize();
