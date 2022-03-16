export interface LatLng {
  longitude: number;
  latitude: number;
}

export interface AppointmentPlace {
  poiId: string; // 우리 서비스 내 poi id
  index: number;
  /** map provider data */
  mapProviderDataId: string; // 맵 서비스 내 id
  title: string; // 시각화에 필요
  category: string; // 시각화에 필요
  address: string; // 시각화에 필요
  latlng: LatLng; // 시각화에 필요
}

export type AppointmentPlacesState = 'ARCHIVED';

export interface AppointmentPlaces {
  appointmentId: string; // AppointmentInformation ID
  places: AppointmentPlace[];
  state: AppointmentPlacesState;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentInformation {
  sequence: number;
  ownerId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  participantIds: string[];
  maxParticipantCount: number;
  currentParticipantCount: number;
  inviteCode: string;
  password?: string;
}
