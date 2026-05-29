import passport, {Profile} from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import {UserRepository} from "../repositories/user.repository";
import {APIUserCreate} from "../models/user";
import {AuthRepository} from "../repositories/auth.repository";

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user_data: APIUserCreate = {
        google_profile_id: profile.id,
        email: profile.emails?.[0].value || '',
        name: profile.displayName,
        picture: profile.photos?.[0].value,
      }

      if (!user_data.email) {
        return done(new Error('[ERROR] Missing E-mail on Google Profile'), false);
      }

      const user = await UserRepository.createIfNotExists(user_data);

      const tokens = await AuthRepository.generateAuthTokens(user);

      return done(null, {...user_data, ...tokens});
    } catch (err) {
      return done(err, false);
    }
  }
));

export const passportInitialize = passport.initialize();
