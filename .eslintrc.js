module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  env: {
    node: true
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/ban-ts-comment": [
      2,
      {
        "ts-ignore": "allow-with-description"
      }
    ]
  }
};
