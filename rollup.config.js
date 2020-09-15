const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');

module.exports = [
  // browser-friendly UMD build
	{
		input: 'index.js',
		external: ['ws'],
		output: {
			name: 'GPUjsHiveCompute',
			file: 'dist/gpujs-hive-compute-browser.js',
			format: 'umd'
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			json()
		]
	},
	// Minified Build
	{
		input: 'index.js',
		external: ['ws'],
		output: {
			name: 'GPUjsHiveCompute',
			file: 'dist/gpujs-hive-compute-browser.min.js',
			format: 'umd'
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			terser(),
			json()
		]
  }
]