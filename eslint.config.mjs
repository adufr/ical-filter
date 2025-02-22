import { sxzz } from "@sxzz/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  sxzz(
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
