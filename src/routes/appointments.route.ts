import { Router } from 'express';
import AppointmentsController from '@controllers/appointments.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateAppointmentDto, ParticipantAppointmentDto } from '@/dtos/appointments.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class AppointmentsRoute implements Routes {
  public path = '/appointments';
  public router = Router();
  public controller = new AppointmentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/owned`, authMiddleware, this.controller.findAllOwned);
    this.router.get(`${this.path}/participated`, authMiddleware, this.controller.findAllParticipated);

    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateAppointmentDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/participate/:id`, authMiddleware, this.controller.participate);
    this.router.put(`${this.path}/:id`, authMiddleware, this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);

    //this.router.get(`${this.path}/:id`, this.controller.getUserById);
    //this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.controller.createUser);
    //this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.controller.updateUser);
    //this.router.delete(`${this.path}/:id`, this.controller.deleteUser);
  }
}

export default AppointmentsRoute;
