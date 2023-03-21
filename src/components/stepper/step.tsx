import { $, component$, useStore, useTask$ } from "@builder.io/qwik";
import { hpBookable } from "~/contexts/bookable-page.context";
import { Step, StepperAnswers } from "~/types/stepper-configuration";
import { StepOption } from "./option";

export const StepQuestion = component$(
  (props: { step: Step; data: hpBookable; answers: StepperAnswers }) => {
    const store = useStore<{ questions: any[] | null }>(
      { questions: null },
      { deep: true }
    );

    useTask$(async ({ track }) => {
      track(() => props.step.question);
      store.questions = await props.step.options(props.data);
    });

    return (
      <>
        <h2>{props.step.question}</h2>
        {store.questions
          ? store.questions.map((option) => (
              <>
                <StepOption
                  onClick={$(
                    (value: any) =>
                      (props.answers[props.step.queryParam] = value)
                  )}
                  class={
                    "m-1 p-4 w-full border-blue-200 text-right  border-2 bg-red-200"
                  }
                  {...option}
                />
                <br />
              </>
            ))
          : ""}
      </>
    );
  }
);
