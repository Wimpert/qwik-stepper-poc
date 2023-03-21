import { FilterData } from "~/types/filter-data";
import {
  CalendarMotiveConfigurationDto,
  IBookableWebPage,
  MotiveCategory,
  MotiveConfigStatus,
  MotivePatientSettingsDto,
  MotiveStatus,
  PatientBookingMotiveDto,
  PatientType,
} from "~/types/org-webpage.dto";

export const filter = (
  page: IBookableWebPage,
  data: FilterData
): IBookableWebPage | null => {
  let filteredPage = { ...page };

  if (data.siteId) {
    filteredPage = filterOnSiteId(filteredPage, data.siteId);
  }

  if (data.hpId) {
    filteredPage = filterOnHpId(filteredPage, data.hpId);
  }

  if (data.patientType) {
    filteredPage = filterMotivesOnPatientType(filteredPage, data.patientType);
  }

  //  filteredPage = filterMotivesBasedCalendars(filteredPage);

  //  filteredPage = filterSitesBasedCalendars(filteredPage);

  //  filteredPage = filterHpsBasedCalendars(filteredPage);

  //  filteredPage = filterSpecialitiesBasedCHps(filteredPage);

  return filteredPage.calendars.length > 0 ? filteredPage : null;
};

const filterOnSiteId = (
  page: IBookableWebPage,
  siteId: string
): IBookableWebPage => {
  const site = page.sites.find((s) => s.id === siteId);
  const calendars = page.calendars.filter((c) => c.siteId === siteId);
  return { ...page, calendars, sites: site ? [site] : page.sites };
};

const filterOnHpId = (
  page: IBookableWebPage,
  hpId: string
): IBookableWebPage => {
  const calendars = page.calendars.filter((c) => c.ownerId === hpId);
  const siteIdsLeft = calendars.map((c) => c.siteId);
  const sites = page.sites.filter((site) => siteIdsLeft.includes(site.id));
  return { ...page, calendars, sites };
};

const filterMotivesOnPatientType = (
  page: IBookableWebPage,
  patientType: PatientType
): IBookableWebPage => {
  const calendarIds = page.calendars.map((c) => c.id);

  let filteredMotives = page.motives.filter((motive) =>
    hasActiveMotiveConfigForAnyCalendar(motive, calendarIds)
  );
  filteredMotives = filteredMotives.filter((motive) =>
    calendarIds.some((calendarId) =>
      motiveCanBeOnlineBookedForCalendar(
        motive,
        calendarId,
        patientType === PatientType.NEW
      )
    )
  );
  return { ...page, motives: filteredMotives };
};

const findActiveMotiveConfigsForCalendarsWhenMotiveIsActive = (
  motive: PatientBookingMotiveDto,
  calendarIds: string[]
): CalendarMotiveConfigurationDto[] =>
  isMotiveActive(motive)
    ? motive.calendarConfigurations.filter(
        (config) =>
          config.status === MotiveConfigStatus.ACTIVE &&
          calendarIds.includes(config.calendarId)
      )
    : [];

const motiveCanBeOnlineBookedForCalendar = (
  motive: PatientBookingMotiveDto,
  calendarId: string,
  isNewPatient: boolean
): boolean => {
  const [config] = findActiveMotiveConfigsForCalendarsWhenMotiveIsActive(
    motive,
    [calendarId]
  );
  if (!config) {
    return false;
  }

  const duration: MotivePatientSettingsDto | undefined = isNewPatient
    ? config.defaultDurations.newPatient
    : config.defaultDurations.existingPatient;

  const allowedMotiveCategories = [MotiveCategory.ALL_PATIENTS];
  if (isNewPatient) {
    allowedMotiveCategories.push(MotiveCategory.NEW_PATIENTS_ONLY);
  } else {
    allowedMotiveCategories.push(MotiveCategory.EXISTING_PATIENTS_ONLY);
  }
  return (
    allowedMotiveCategories.includes(config.category) &&
    !!duration?.isOnlineBookingAllowed
  );
};

const isMotiveActive = (
  motive: Pick<PatientBookingMotiveDto, "status">
): boolean => motive.status === MotiveStatus.ACTIVE;

const isMotiveArchived = (
  motive: Pick<PatientBookingMotiveDto, "status">
): boolean => motive.status === MotiveStatus.ARCHIVED;

const motiveIsSupportedForCalendarAndPatientType = (
  motive: PatientBookingMotiveDto,
  calendarId: string,
  isNewPatient: boolean
): boolean => {
  const [config] = findActiveMotiveConfigsForCalendarsWhenMotiveIsActive(
    motive,
    [calendarId]
  );
  const allowedMotiveCategories = [MotiveCategory.ALL_PATIENTS];
  if (isNewPatient) {
    allowedMotiveCategories.push(MotiveCategory.NEW_PATIENTS_ONLY);
  } else {
    allowedMotiveCategories.push(MotiveCategory.EXISTING_PATIENTS_ONLY);
  }
  return allowedMotiveCategories.includes(config?.category);
};

const isMotiveActiveForAnyCalendar = (
  motive: PatientBookingMotiveDto,
  calendarIds: string[]
): boolean => {
  if (!isMotiveActive(motive)) {
    return false;
  }

  return hasActiveMotiveConfigForAnyCalendar(motive, calendarIds);
};

const hasActiveMotiveConfigForAnyCalendar = (
  motive: PatientBookingMotiveDto,
  calendarIds: string[]
): boolean => {
  return motive.calendarConfigurations.some(
    (conf) =>
      calendarIds.includes(conf.calendarId.toString()) &&
      conf.status === MotiveConfigStatus.ACTIVE
  );
};

// export const getMotiveDurationPerActiveCalendar = (
//   motive: Pick<PatientBookingMotiveDto, "calendarConfigurations">,
//   calendarIds: string[],
//   isNewPatient: boolean,
//   enforceBookingOnline: boolean
// ): Record<string, number> => {
//   const calendarIdWithDuration = motive.calendarConfigurations
//     .filter(
//       (calendarConfiguration) =>
//         calendarConfiguration.status === MotiveConfigStatus.ACTIVE &&
//         calendarIds.includes(calendarConfiguration.calendarId.toString())
//     )
//     .map(({ calendarId, defaultDurations }) => {
//       const duration = isNewPatient
//         ? defaultDurations.newPatient
//         : defaultDurations.existingPatient;

//       return [calendarId, duration?.duration, duration?.isOnlineBookingAllowed];
//     })
//     .filter(
//       ([, duration, isOnlineBookingAllowed]) =>
//         !!duration && (!enforceBookingOnline || isOnlineBookingAllowed)
//     );

//   return fromPairs(calendarIdWithDuration);
// };

// export const isDurationAndCategoryEqual = (
//   a: MotiveConfigurationDto,
//   b: MotiveConfigurationDto
// ): boolean => {
//   return (
//     a.category === b.category && isEqual(a.defaultDurations, b.defaultDurations)
//   );
// };

// export const activeOrNonDefaultConfigurations = (
//   motive: Pick<MotiveDto, "calendarConfigurations" | "defaultConfiguration">
// ): CalendarMotiveConfigurationDto[] => {
//   return (
//     motive.calendarConfigurations.filter(
//       (config) =>
//         config.status === MotiveConfigStatus.ACTIVE ||
//         !isDurationAndCategoryEqual(config, motive.defaultConfiguration)
//     ) || []
//   );
// };
