import { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import { verifyToken } from '../lib/auth';
import { expressAsyncHandler } from '../lib/expressAsyncHandler';
import AppError from '../lib/appError';

export const protect = expressAsyncHandler(async (req, res, next) => {
  let token = null;

  if (
    req.headers['authorization'] &&
    req.headers['authorization'].split(' ')[0] === 'Bearer'
  ) {
    token = req.headers['authorization'].split(' ')[1];

    if (!token) {
      return next(new AppError('Unauthorized: Access token not found', 401));
    }

    const { id, iat, exp } = verifyToken(token) as JwtPayload;

    if (Date.now() - (iat as number) * 1000 > (exp as number)) {
      res.status(401).json({
        status: 'fail',
        error: 'Your session has expired. Please log in again.',
      });
      return;
    }

    const user = await User.findById(id).lean();
    if (!user) {
      res.status(401).json({
        status: 'fail',
        error: 'User has either been deleted or does not exist',
      });
      return;
    }

    req.user = { ...user, id: req.user.id };
    next();
  } else {
    res.status(401).json({ status: 'fail', error: 'Not authorized' });
  }
});
