import { adufr } from "@adufr/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  adufr(
    [
      /* custom config */
    ],
    {
      prettier: true,
      markdown: true,
      vue: true,
    },
  ),
);
