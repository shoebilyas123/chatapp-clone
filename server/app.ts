// NPM imports
import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import path from 'path';
import helmet from 'helmet';

// Local imports
import AppError from './utils/appError';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import errorController from './controller/Error.controller';

const app = express();

const awsURL =
  'https://shoebilyas-chats-profile-pic.s3.ap-south-1.amazonaws.com';

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/public')));

//Data sanitization against xss attack
app.use(xss());
// Data sanitization against noSQL query injectoin
app.use(mongoSanitize());
// Set security http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // other directives

        'img-src': ["'self'", awsURL],
        'connect-src': ["'self'", awsURL],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    //
  })
);
// strict-origin-when-cross-origin

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('*', limiter);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-rigin-Resource-Policy', 'cross-origin');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/users', userRoutes);
app.use('/api/v2/chats', chatRoutes);
app.use(errorController);

export default app;
