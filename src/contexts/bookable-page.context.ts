import { createContextId } from "@builder.io/qwik";
import { IBookableWebPage } from "~/types/org-webpage.dto";

export type hpBookable = { firstName?: string } & IBookableWebPage;

export const bookablePageContextId = createContextId<hpBookable>(
  "BOOKABLE_PAGE_CONTEXT"
);
