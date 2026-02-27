module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-dynamic-import',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs'
  ]
};
