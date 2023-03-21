import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";

export const useServerTimeLoader = loader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => (
  <>
    <main>
      <section>
        <Slot />
      </section>
    </main>
    <footer class="mt-2 text-2xl text-center text-rose-400">
      Made with ♡ For Rosa
    </footer>
  </>
));
