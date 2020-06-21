module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  plugins: ["@typescript-eslint"],
  extends: ["airbnb-typescript/base", "prettier/@typescript-eslint"],
  env: {
    node: true
  },
  rules: {
    "no-console": "off"
  }
};
