import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';
import AppointmentsRoute from '@routes/appointments.route';
import UserModel from '@models/users.model';
import AppointmentModel from '@models/appointments.model';
import authMiddleware from '@/middlewares/auth.middleware';
import { User } from '@/interfaces/users.interface';

let app;

const token = '';

jest.mock('../middlewares/auth.middleware', () => {
  return jest.fn((req, res, next) => {
    console.log('test');
    req.user = { _id: 'testId' } as User;
    next();
  });
});

beforeAll(async () => {});

afterAll(async () => {
  //await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

  app && app.close();
});

describe('Testing Appointments', () => {
  describe('[POST] /appointments', () => {
    it('response Create Appointment', async () => {
      const data = {
        title: 'test title',
        period: 33,
      };
      const route = new AppointmentsRoute();
      const model = AppointmentModel;

      model.findOne = jest.fn().mockReturnValue(null);
      model.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        title: data.title,
        period: data.period,
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([route]);
      return request(app.getServer()).post(`${route.path}`).send(data).expect(201);
    });
  });
});
