import 'reflect-metadata';
import express, {Application} from 'express';

require('dotenv').config();
import {RegisterRoutes} from '../build/routes';
import {errorHandler} from "./middlewares/error_handler";
import {configureSwagger} from './config/swagger';
import {passportInitialize} from "./config/passport";
import passport from "passport";
import "./queues/workers/booking_worker";
import { responseWrapper } from './middlewares/response_wrapper';

const app: Application = express();

app.use(express.json());

// Swagger Configuration
configureSwagger(app);

app.use(passportInitialize);

// Google login
app.get('/api/v1/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Callback
app.get('/api/v1/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', {session: false}, (err, user) => {
    if (err || !user) {
      console.error('Authentication error:', err);
      return res.redirect(`${process.env.AUTH_REDIRECT_URL}?error=1`);
    }

    return res.redirect(`${process.env.AUTH_REDIRECT_URL}?token=${user.token}`);
  })(req, res, next);
});

// Error handler
app.use(errorHandler);

// Response wrapper
app.use(responseWrapper);

// Register routes
RegisterRoutes(app);

export default app;
