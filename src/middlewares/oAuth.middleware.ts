import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { User } from '@/interfaces/users.interface';

// 20220226 TODO: 토큰 받기부터 전부 구현해두는게 맞겠다. 클라이언트에서만 구현하는게 보안상 금지되어있다고 했던것 같으니까.

const oAuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);

    // get oauth provider
    const oauthProvider = req.query.provider as string;
    switch (oauthProvider) {
      case 'kakao':

      case '':
        next(
          new HttpException(401, 'Wrong authentication token. No provider.'),
        );
    }

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey,
      )) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = (await userModel.findById(userId)) as User;

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default oAuthMiddleware;
