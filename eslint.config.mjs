import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    // antfu module config
    {
      vue: true,
      typescript: true,

      yaml: true,
      jsonc: true,
      markdown: true,
    },
    // flat configs
    {},
    // rules
    {
      rules: {
      },
    },
  ),
)
