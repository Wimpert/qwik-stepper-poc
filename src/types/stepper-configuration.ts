import { QRL } from "@builder.io/qwik";
import { hpBookable } from "~/contexts/bookable-page.context";
import { BookingQueryParamsNames } from "./booking-query-params";
import { IBookableWebPage } from "./org-webpage.dto";

type Option<T> = {
  label: string;
  value: T;
};

export type Step = {
  question: string;
  options: QRL<(bookable: hpBookable) => Option<string | number | boolean>[]>;
  queryParam: BookingQueryParamsNames;
};

export type StepperAnswers = {
  [key in BookingQueryParamsNames]?: string | number | boolean;
};

export type StepperConfiguration = {
  steps: Step[];
  answers: StepperAnswers;
};
