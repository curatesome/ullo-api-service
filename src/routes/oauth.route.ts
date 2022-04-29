import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

/**
 * oauth 서비스를 통해 회원가입/로그인 지원.
 * oauth token 관리는 클라이언트에서 진행하고, 이 서버는 이미 발행된 token을 이용해 검증을 진행.
 */
class OAuthRoute implements Routes {
  public path = '/oauth/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.signUp,
    );
    this.router.post(
      `${this.path}login`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.logIn,
    );
    this.router.post(
      `${this.path}logout`,
      authMiddleware,
      this.authController.logOut,
    );
  }
}

export default OAuthRoute;
