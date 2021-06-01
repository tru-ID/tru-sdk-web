import pkg from './package.json'

export default [
  // CommonJS (for Node), ES module (for bundlers) and browser-friendly UMD build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      {
        name: 'tru.ID',
        file: pkg.browser,
        format: 'umd',
      },
    ],
  },
]
