import { AppointmentPlacesState } from '@/interfaces/appointment.interface';
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

class LatLng {
  @prop({ type: Number, required: true })
  public longitude: number;

  @prop({ type: Number, required: true })
  public latitude: number;
}

class AppointmentPlace {
  @prop({ type: String, required: true })
  public poiId: string;

  @prop({ type: Number, required: true })
  public index: number;

  @prop({ type: String, required: true })
  public mapProviderDataId: string;
  @prop({ type: String, required: true })
  public title: string;
  @prop({ type: String, required: true })
  public category: string;
  @prop({ type: String, required: true })
  public address: string;

  @prop({ type: LatLng, required: true })
  public latlng: LatLng;
}

@modelOptions({ schemaOptions: { collection: 'appointmentPlaces', timestamps: true } })
class AppointmentPlaces {
  @prop({ type: String, required: true })
  public appointmentId: string;

  @prop({ type: [AppointmentPlace], required: true })
  public places: AppointmentPlace[];

  @prop({ type: String, required: true })
  public state: AppointmentPlacesState;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const AppointmentPlacesModel = getModelForClass(AppointmentPlaces);

@modelOptions({ schemaOptions: { collection: 'appointments', timestamps: true } })
class AppointmentInformation {
  @prop({ type: Number, required: false })
  public sequence: number;

  @prop({ type: String, required: true })
  public ownerId: string;

  @prop({ type: String, required: true })
  public title: string;

  public createdAt?: Date;

  public updatedAt?: Date;

  @prop({ type: Date, required: true })
  public expiredAt: Date;

  @prop({ type: [String], required: true })
  public participantIds: string[];

  @prop({ type: Number, required: true })
  public maxParticipantCount: number;

  @prop({ type: Number, required: true })
  public currentParticipantCount: number;

  @prop({ type: String, required: false, unique: true })
  public inviteCode: string;

  @prop({ type: String, required: false })
  public password: string;
}

export const AppointmentModel = getModelForClass(AppointmentInformation);

export default AppointmentModel;
