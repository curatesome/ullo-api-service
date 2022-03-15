export interface LatLng {
    longitude: number
    latitude: number
}

export interface AppointmentPlace {
    poiId: string  // 우리 서비스 내 poi id
    index: number
    /** map provider data */
    mapProviderDataId: string // 맵 서비스 내 id
    title: string  // 시각화에 필요
    category: string // 시각화에 필요
    address: string  // 시각화에 필요
    latlng: LatLng // 시각화에 필요
}

export type AppointmentPlaceManagementState = 'ARCHIVED'

export interface AppointmentPlaceManagement {
    appointmentId: string // AppointmentInformation ID
    places: AppointmentPlace[]
    state: AppointmentPlaceManagementState
    createdAt: Date
    updatedAt: Date
}

export interface AppointmentInformation {
    placesId: string // AppointmentPlaceManagement ID
    title: string
    createdAt: Date
    updatedAt: Date
    expiredAt: Date
}