const esbuild = require('esbuild');
const { transform } = require('@swc/core');
const fs = require('fs').promises;

const swcPlugin = {
  name: 'swc',
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      const source = await fs.readFile(args.path, 'utf8');
      const { code } = await transform(source, {
        filename: args.path,
        jsc: {
          parser: {
            syntax: 'typescript',
          },
        },
      });
      return { contents: code, loader: 'js' };
    });
  },
};

esbuild.build({
  entryPoints: ['main.ts'],
  bundle: true,
  outfile: 'main.js',
  plugins: [swcPlugin],
  sourcemap: true,  // Enable source map generation here
  target: 'es2015',
}).catch(() => process.exit(1));
