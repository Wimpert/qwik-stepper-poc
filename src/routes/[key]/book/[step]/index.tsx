import {
  $,
  component$,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { StepQuestion } from "~/components/stepper/step";
import {
  bookablePageContextId,
  hpBookable,
} from "~/contexts/bookable-page.context";
import { stepperContextId } from "~/contexts/stepper-context";
import { BookingQueryParamsNames } from "~/types/booking-query-params";
import { IBookableWebPage } from "~/types/org-webpage.dto";
import {
  Step,
  StepperAnswers,
  StepperConfiguration,
} from "~/types/stepper-configuration";
import { filter } from "~/components/utils/filter-bookable-web-page";
import { convertSearchParamsToFilterData } from "~/types/filter-data";

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const stepStore = useStore<{
    currentStep: Step;
  }>(
    {
      currentStep: {} as Step,
    },
    { deep: true }
  );

  const initialAnswers = Object.values(BookingQueryParamsNames).reduce(
    (acc, key) => ({ ...acc, [key]: undefined }),
    {}
  );

  const answerStore = useStore<{
    answers: StepperAnswers;
  }>({ answers: initialAnswers }, { deep: true });

  const bookablePage = useContext<hpBookable>(bookablePageContextId);
  const stepperStore = useStore({});
  useContextProvider(stepperContextId, stepperStore);
  const currentStepIndex = useSignal<number>();

  const configuration: StepperConfiguration = {
    steps: [
      {
        question: "Is this your First Visit?",
        options: $(() => [
          { label: "yes", value: 1 },
          { label: "no", value: 0 },
        ]),
        queryParam: BookingQueryParamsNames.FIRST_TIME,
      },
      {
        question: "Where do you want to book",
        options: $((data) =>
          data.sites.map((site) => ({
            label: site.name,
            value: site.id,
          }))
        ),
        queryParam: BookingQueryParamsNames.SITE_ID,
      },

      {
        question: "What is the reason for you visit",
        options: $((data) =>
          data.motives.map((motive) => ({
            label: (motive as any).label,
            value: motive.id,
          }))
        ),
        queryParam: BookingQueryParamsNames.MOTIVE_ID,
      },
    ],
    answers: {},
  };

  useTask$(() => {
    currentStepIndex.value = Number(loc.params.step);
  });

  useTask$(({ track }) => {
    track(() => currentStepIndex.value);
    stepStore.currentStep =
      configuration.steps[
        currentStepIndex.value ? currentStepIndex.value - 1 : 0
      ];
  });

  useTask$(({ track }) => {
    track(() => answerStore.answers[stepStore.currentStep?.queryParam]);
    console.log("hye");
    if (
      isBrowser &&
      stepStore.currentStep &&
      answerStore.answers &&
      answerStore.answers[stepStore.currentStep?.queryParam]
    ) {
      const params = loc.url.searchParams;
      params.set(
        stepStore.currentStep?.queryParam,
        `${answerStore.answers[stepStore.currentStep?.queryParam]}`
      );
      // not sure about this ...:
      nav(loc.url.href, false);
    }
  });

  useTask$(({ track }) => {
    track(() => loc.url.searchParams);
    const filteredValue = filter(
      { ...bookablePage },
      convertSearchParamsToFilterData(loc.url.searchParams.toString() as any)
    );
    if (filteredValue) {
      bookablePage.calendars = filteredValue?.calendars;
      bookablePage.motives = filteredValue?.motives;
      bookablePage.sites = filteredValue?.sites;
    }
  });

  const handleStepNav = $((dir: -1 | 1) => {
    const newStep = Math.max(0, Number(loc.params.step) + dir);
    const search = loc.url.searchParams;
    nav(`../${newStep}?${search.toString()}`, false);
    currentStepIndex.value = newStep;
  });

  return (
    <>
      <h1>Step {currentStepIndex.value}</h1>
      {stepStore.currentStep ? (
        <>
          <div>{answerStore.answers[stepStore.currentStep?.queryParam]}</div>
          <StepQuestion
            step={stepStore.currentStep}
            answers={answerStore.answers}
            data={bookablePage}
          />
        </>
      ) : (
        "No more questions"
      )}
      <button class="m-1 p-2 bg-green-400" onClick$={() => handleStepNav(-1)}>
        Prev
      </button>
      <button class="m-1 p-2 bg-green-400" onClick$={() => handleStepNav(1)}>
        Next
      </button>
    </>
  );
});
