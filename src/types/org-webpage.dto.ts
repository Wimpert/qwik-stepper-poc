export type IBookableWebPage = {
  id: string;
  sites: PatientBookingSiteDto[];
  calendars: PatientBookingCalendarDto[];
  motives: PatientBookingMotiveDto[];
};

type PatientBookingSiteDto = {
  id: string;
  name: string;
  organizationId: string;
};

type PatientBookingCalendarDto = {
  id: string;
  siteId: string;
  ownerId: string;
};

export type PatientBookingMotiveDto = {
  id: string;
  organizationId: string;
  rosaSpecialtyIds: string[];
  allowedLocation: LocationType;
  status: MotiveStatus;
  defaultConfiguration: MotiveConfigurationDto;
  calendarConfigurations: CalendarMotiveConfigurationDto[];
};

export enum LocationType {
  AT_PATIENT = "AT_PATIENT",
  AT_SITE = "AT_SITE",
}

export enum MotiveStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum MotiveConfigStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

type MotiveConfigurationDto = {
  status: MotiveConfigStatus;
  category: MotiveCategory;
  defaultDurations: MotiveSettingsDto;
};

export type CalendarMotiveConfigurationDto = MotiveConfigurationDto & {
  calendarId: string;
};

type MotiveSettingsDto = {
  existingPatient?: MotivePatientSettingsDto;
  newPatient?: MotivePatientSettingsDto;
};

export enum MotiveCategory {
  NEW_PATIENTS_ONLY = "NEW_PATIENTS_ONLY",
  EXISTING_PATIENTS_ONLY = "EXISTING_PATIENTS_ONLY",
  ALL_PATIENTS = "ALL_PATIENTS",
}

export type MotivePatientSettingsDto = {
  isOnlineBookingAllowed: boolean;
  duration: number;
};

export enum PatientType {
  NEW,
  EXISTING,
}
