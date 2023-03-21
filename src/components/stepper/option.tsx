import { component$, QRL, $ } from "@builder.io/qwik";

export const StepOption = component$(
  (props: { label: string; value: any; class: string; onClick: QRL }) => {
    return (
      <button
        onClick$={$(() => props.onClick(props.value))}
        class={props.class}
      >
        {props.label}
      </button>
    );
  }
);
