import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import sass from 'node-sass';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		file: 'public/bundle.js'
	},
	name: 'app',
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/bundle.css');
			},

			// this results in smaller CSS files
			cascade: false,

			preprocess: {
				style: ({ content, attributes }) => {
					if (attributes.type !== 'text/scss') return;

					return new Promise((fulfil, reject) => {
						sass.render({
							data: content,
							includePaths: ['src'],
							sourceMap: true,
							outFile: 'x' // this is necessary, but is ignored
						}, (err, result) => {
							if (err) return reject(err);

							fulfil({
								code: result.css.toString(),
								map: result.map.toString()
							});
						});
					});
				}
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve(),
		commonjs(),

		// If we're building for production (npm run build
		// instead of npm run dev), transpile and minify
		production && buble({ exclude: 'node_modules/**' }),
		production && uglify()
	]
};