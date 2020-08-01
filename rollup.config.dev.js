const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = [
  // browser-friendly UMD build
	{
		input: 'index.js',
		output: {
			name: 'GPUjsHiveCompute',
			file: 'dist/gpujs-hive-compute-browser.js',
			format: 'umd'
		},
		plugins: [
			nodeResolve(),
			commonjs()
		]
	}
]