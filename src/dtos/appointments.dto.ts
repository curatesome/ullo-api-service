import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  public title: string;
  @IsNumber()
  public period: number;

  public maxParticipantCount: number;
  public password: string;
}

export class ParticipantAppointmentDto {
  @IsString()
  public appointmentId: string;
}
