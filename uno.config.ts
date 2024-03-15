import { defineConfig, presetWind, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
