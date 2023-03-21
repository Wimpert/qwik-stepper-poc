import { BookingQueryParamsNames } from "./booking-query-params";
import { PatientType } from "./org-webpage.dto";

export type FilterData = {
  siteId: string;
  motiveId: string;
  hpId: string;
  patientType: PatientType;
  specialtyId: string;
};

export const convertSearchParamsToFilterData = (
  searchParams: Record<BookingQueryParamsNames, string>
): FilterData => {
  return {
    siteId: searchParams[BookingQueryParamsNames.SITE_ID],
    motiveId: searchParams[BookingQueryParamsNames.MOTIVE_ID],
    hpId: searchParams[BookingQueryParamsNames.HP_ID],
    patientType: searchParams[BookingQueryParamsNames.HP_ID]
      ? PatientType.NEW
      : PatientType.EXISTING,
    specialtyId: searchParams[BookingQueryParamsNames.SPECIALTY_ID],
  };
};
