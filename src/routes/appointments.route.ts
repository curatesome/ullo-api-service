import { Router } from 'express';
import AppointmentsController from '@controllers/appointments.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateAppointmentDto } from '@/dtos/appointments.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class AppointmentsRoute implements Routes {
  public path = '/appointments';
  public router = Router();
  public controller = new AppointmentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/owned`,
      authMiddleware,
      this.controller.findAllOwned,
    );
    this.router.get(
      `${this.path}/participated`,
      authMiddleware,
      this.controller.findAllParticipated,
    );

    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateAppointmentDto, 'body'),
      this.controller.create,
    );
    this.router.put(
      `${this.path}/participate/:code`,
      authMiddleware,
      this.controller.participate,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateAppointmentDto, 'body'),
      this.controller.update,
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.controller.delete,
    );
  }
}

export default AppointmentsRoute;
