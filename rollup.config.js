import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default {
	input: './index',
	output: [{
		file: pkg.main,
		format: 'cjs',
	}, {
		file: pkg.module,
		format: 'es',
	}, {
		file: pkg.unpkg,
		name: 'bitsyMerge',
		format: 'iife',
	}],
	plugins: [
		resolve(),
		commonjs(),
		babel(),
	],
}
