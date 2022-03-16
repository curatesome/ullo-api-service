import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';

import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { CreateAppointmentDto, ParticipantAppointmentDto } from '@/dtos/appointments.dto';
import AppointmentModel, { AppointmentInformation } from '@/models/appointments.model';
import { logger } from '@/utils/logger';
import { randomInt } from 'crypto';
import { getNextSequence } from '@/models/counters.model';

class AppointmentService {
  key = 'appointments';

  /** create appointment */
  public async create(user: User, data: CreateAppointmentDto) {
    const ownerId = user._id;
    const { title, period, maxParticipantCount, password } = data;

    const expiredAt = new Date();
    expiredAt.setUTCDate(expiredAt.getUTCDate() + period);

    const hashedPassword = password ? await hash(password, 10) : undefined;
    const sequence = await getNextSequence(this.key);
    const inviteCode = this.getInviteCode(sequence);

    const got: AppointmentInformation = await AppointmentModel.create({
      ownerId,
      title,
      expiredAt,
      participantIds: [ownerId],
      maxParticipantCount: maxParticipantCount || 8,
      currentParticipantCount: 1,
      password: hashedPassword,
      sequence,
      inviteCode,
    });
    return got;
  }
  /** 소문자 알파벳 3-4-3 -> 10자리, 26^10, 약 141조.
   * 141167100000000
   */
  getInviteCode(idx: number) {
    const pool = 'abcdefghijklmnopqrstuvwxyz';
    const len = pool.length;
    const codes = [];
    let nextIdx = idx + 1234234534565678;
    for (const i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const got = this.getCodeIndex(nextIdx);
      nextIdx = got.idx;
      codes.push(pool[got.code])
      if (i === 2 || i === 6) {
        codes.push('-')
      }
    }
    return codes.join('')
  }

  getCodeIndex(idx: number) {
    return { idx: Math.floor(idx / 26), code: idx % 26 };
  }
  getRandomChar(pool: string) {
    return pool[randomInt(pool.length)];
  }

  /** 약속 참여하기
   * 2 queries: find pre item(1) -> update(2)
   */

  public async participate(user: User, data: ParticipantAppointmentDto) {
    const userId = user._id;
    const { appointmentId } = data;

    const doc: AppointmentInformation = await AppointmentModel.findById(appointmentId);

    // 중복 참여 방지
    if (doc.participantIds.includes(userId)) {
      throw new HttpException(400, 'duplicated user (already participated)');
    }

    const maxCount = doc.maxParticipantCount;
    const preCount = doc.currentParticipantCount;

    const got: AppointmentInformation = await AppointmentModel.findOneAndUpdate(
      { _id: appointmentId, currentParticipantCount: { $lt: maxCount } },
      {
        $inc: { currentParticipantCount: 1 },
        $push: { participantIds: userId },
      },
      { new: true }, // 업데이트된 문서를 받음
    );

    if (got && preCount != got.currentParticipantCount) {
      // 성공
      return got;
    } else {
      throw new HttpException(400, 'exceeded participants');
    }
  }

  /** 정보 수정 */
  public async update(user: User, appointmentId: string, data: CreateAppointmentDto) {
    const userId = user._id;
    const { title, period } = data;

    const doc = await AppointmentModel.findById(appointmentId);
    if (doc.ownerId.toString() !== userId.toString()) {
      throw new HttpException(400, 'invalid user');
    }

    if (title) {
      doc.title = title;
    }
    if (period) {
      doc.expiredAt = new Date();
      doc.expiredAt.setUTCDate(doc.expiredAt.getUTCDate() + period);
    }
    const got: AppointmentInformation = await doc.save();
    return got;
  }

  /** user가 참여하고 있는 아이템들 */
  public async getListParticipated(user: User) {
    const userId = user._id;

    const got: AppointmentInformation[] = await AppointmentModel.find({
      participantIds: userId,
    });

    return got;
  }

  /** user가 생성한 아이템들 */
  public async getListOwned(user: User) {
    const ownerId = user._id;

    const got: AppointmentInformation[] = await AppointmentModel.find({
      ownerId,
    });
    return got;
  }

  public async getUsingInviteCode(code: string) {
    const got: AppointmentInformation = await AppointmentModel.findOne({
      inv,
    });
  }

  public async delete(user: User, appointmentId: string) {
    const userId = user._id;
    const doc = await AppointmentModel.findById(appointmentId);
    if (doc.ownerId.toString() !== userId.toString()) {
      throw new HttpException(400, 'invalid user');
    }

    const got = await doc.delete();
    return got;
  }
}

export default AppointmentService;
