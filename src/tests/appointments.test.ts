import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { redisClient } from '../cache/redisCache';

import request from 'supertest';
import App from '../app';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRoute from '../routes/appointments.route';
import AppointmentsRoute from '../routes/appointments.route';
import UserModel from '../models/users.model';
import AppointmentModel from '../models/appointments.model';
import authMiddleware from '../middlewares/auth.middleware';
import { User } from '../interfaces/users.interface';
import { getNextSequence } from '../models/counters.model';
import { AppointmentInformation } from '../interfaces/appointment.interface';
import assert, { ok } from 'assert';
//import * as MOCK from './utils/mock';

const store = {};
const storeValue = (key, val) => {
  console.log(`[Store] ${key} -> ${val}`);
  store[key] = val;
};

/** mock */
jest.mock('@middlewares/auth.middleware', () => {
  return jest.fn((req, res, next) => {
    const id =
      req.cookies['Authorization'] ||
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);
    console.log(id);
    req.user = { _id: id } as User;
    next();
  });
});

/** app start */
const route = new AppointmentsRoute();
const app = new App([route]);

//beforeAll(async () => {});

afterAll(async () => {
  console.log('afterAll');
  await mongoose.connection.dropDatabase();
  await app.closeAsync();
});

describe('Testing Appointments', () => {
  describe('[POST] /appointments', () => {
    it('response Create Appointment', async () => {
      const data = {
        title: 'test title',
        period: 33,
      };

      return request(app.getServer())
        .post(`${route.path}`)
        .auth('myId', { type: 'bearer' })
        .send(data)
        .expect(201);
    });
  });

  describe('[PUT] /appointments/participate', () => {
    /** create */
    it.each([
      ['inviteCode1', 'creator1'],
      ['inviteCode2', 'creator2'],
    ])('[%s] response Create Appointment %s', async (code, id) => {
      const data = {
        title: 'test title',
        period: 33,
      };

      return request(app.getServer())
        .post(`${route.path}`)
        .auth(id, { type: 'bearer' })
        .send(data)
        .expect(res => {
          storeValue(code, res.body.data.inviteCode);
          storeValue(code + 'id', res.body.data._id);
          if (res.status == 201) return true;
        });
    });

    /** participate */
    it.each([
      ['inviteCode1', '1', 2, true, ''],
      ['inviteCode1', '2', 3, true, ''],

      ['inviteCode2', '1', 2, true, ''],
      ['inviteCode2', '2', 3, true, ''],

      ['inviteCode1', '3', 4, true, ''],
      ['inviteCode1', '4', 5, true, ''],
      ['inviteCode1', '5', 6, true, ''],
      ['inviteCode1', '6', 7, true, ''],
      ['inviteCode1', '7', 8, true, ''],
      ['inviteCode1', '8', 0, false, 'exceeded participants'],
      ['inviteCode1', '1', 0, false, 'duplicated user (already participated)'],
    ])(
      '[%s] response Participate Appointment %s / %s falsy:%s error: %s',
      (
        code: string,
        id: string,
        count: number,
        falsy: boolean,
        errMsg: string,
      ) => {
        const param = store[code];
        return request(app.getServer())
          .put(`${route.path}/participate/${param}`)
          .auth(id, { type: 'bearer' })
          .expect(res => {
            const data: AppointmentInformation = res.body.data;
            if (falsy) {
              console.log(data.participantIds);
              expect(res.status).toBe(200);
              expect(data.currentParticipantCount).toBe(count);
              expect(data.participantIds.includes(id)).toBe(true);
            } else {
              expect(res.status).toBe(400);
              if (res.error) {
                expect(res.body.message).toBe(errMsg);
              }
            }
          });
      },
    );

    /** delete */
    it.each([
      ['inviteCode1id', 'creator1', true, ''],
      ['inviteCode2id', 'creator1', false, 'invalid user'],
      ['inviteCode2id', 'creator2', true, ''],
    ])('delete %s, auth: %s, falsy: %s %s', (id, auth, falsy, errMsg) => {
      const param = store[id];
      return request(app.getServer())
        .delete(`${route.path}/${param}`)
        .auth(auth, { type: 'bearer' })
        .expect(res => {
          if (falsy) {
            expect(res.status).toBe(200);
          } else {
            expect(res.status).toBe(400);
            expect(res.body.message).toBe(errMsg);
          }
        });
    });
  });
});
