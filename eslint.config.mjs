// @ts-check
import { adufr } from '@adufr/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  adufr(
    {
      vue: true,
      prettier: true,
      markdown: true,
    },
    [
      {
        rules: {
          // there's a bug somewhere preventing the correct parsing of the template, which causes this rule to report false positives
          'no-useless-assignment': 'off',
        },
      },
    ],
  ),
)
