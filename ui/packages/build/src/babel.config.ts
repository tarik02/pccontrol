export default {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: 'last 2 versions, not IE 11',
        exclude: ['transform-regenerator'],
      },
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
};
