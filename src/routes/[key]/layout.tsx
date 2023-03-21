// src/routes/index.ts
import {
  component$,
  Resource,
  Slot,
  useContextProvider,
  useResource$,
  useStore,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  bookablePageContextId,
  hpBookable,
} from "~/contexts/bookable-page.context";

export const useGetHpData = routeLoader$<hpBookable>(
  async ({ request, json, params }) => {
    return fetch(
      `https://staging-api.rosa.be/api/web-pages/hps/${params.key}/hp-details`
    ).then((res) => res.json());
  }
);

export default component$(() => {
  const hpData = useGetHpData();

  const store = useStore(hpData.value);
  useContextProvider(bookablePageContextId, store);

  return (
    <>
      <h1>{hpData.value.firstName}</h1>
      <Slot />
    </>
  );
});
