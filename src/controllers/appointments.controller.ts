import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import AppointmentService from '@/services/appointments.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateAppointmentDto } from '@/dtos/appointments.dto';
import { logger } from '@/utils/logger';

class AppointmentsController {
  public appointmentService = new AppointmentService();

  /** 해당 유저가 참여한 모든 아이템 반환 */
  public findAllParticipated = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const got = await this.appointmentService.getListParticipated(user);

      res.status(200).json({ data: got, message: 'findAllParticipated' });
    } catch (error) {
      next(error);
    }
  };

  /** 해당 유저가 생성한 모든 아이템 반환 */
  public findAllOwned = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const got = await this.appointmentService.getListOwned(user);

      res.status(200).json({ data: got, message: 'findAllOwned' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const data: CreateAppointmentDto = req.body;
      const got = await this.appointmentService.create(user, data);
      res.status(201).json({ data: got, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  /** 특정 appointment에 참여 요청
   * 인원 수 확인 필요?
   *
   */
  public participate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { code } = req.params;

      const doc = await this.appointmentService.getUsingInviteCode(code);
      const appointmentId = doc._id;

      const got = await this.appointmentService.participate(user, { appointmentId });
      res.status(200).json({ data: got, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const appointmentId: string = req.params.id;
      const data: CreateAppointmentDto = req.body;
      const got = await this.appointmentService.update(user, appointmentId, data);

      res.status(200).json({ data: got, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const appointmentId: string = req.params.id;
      const got = await this.appointmentService.delete(user, appointmentId);

      res.status(200).json({ data: got, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default AppointmentsController;
