export default {
  build: {
    minify: 'esbuild',
    target: "esnext",
  },
  // vite assumes your website is at the root url path, but we are working out of our gh-pages url:
  // https://kooshnoo.github.io/pokemon-programming/
  base: '/pokemon-programming/'
};