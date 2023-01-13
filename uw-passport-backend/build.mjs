import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['index.mjs'],
  bundle: true,
  platform: 'node',
  minify: true,
  sourcemap: 'inline',
  target: 'esnext',
  // có thể bị lỗi ReferenceError: __dirname is not defined in ES module scope
  // format: 'esm',
  format: 'cjs',
  banner: {
    // js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  external: [
    'canvas',
    'nock',
    'aws-sdk',
    'mock-aws-s3',
  ],
  // outfile: 'dist/index.mjs',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1))
