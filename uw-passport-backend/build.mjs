import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['index.mjs'],
  bundle: true,
  platform: 'node',
  minify: true,
  sourcemap: 'inline',
  target: 'esnext',
  format: 'esm',
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  external: [
    'canvas',
    'nock',
    'aws-sdk',
    'mock-aws-s3',
  ],
  outfile: 'dist/index.mjs',
}).catch(() => process.exit(1))
