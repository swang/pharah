// setup by `npm i rollup rollup-plugin-babel babel-preset-es2015 babel-plugin-external-helpers --save-dev`
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel  = require('rollup-plugin-babel')
const rollup  = require('rollup')

const { dependencies } = require('./package.json');

// build.js:
rollup.rollup({
  input: "./main.js",
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
      main: true

    }),
    commonjs({
      include: ["node_modules/**"],
    }),
    babel({
      exclude: 'node_modules/**',
      "presets": [
        ["env", {
          "modules": false
        }]
      ],
      "plugins": [
        ["transform-react-jsx", { "pragma":"h" }],
        "external-helpers"
      ]

    })
  ]
}).then(bundle => {
  bundle.generate({
    format: 'iife',
    globals: { "fetch-base64-in-browser": "FetchBase64" }
  }).then((result) => {
    require("fs").writeFileSync("./dist/bundle.js", result.code);
  })
}).then(null, err => console.error(err));
