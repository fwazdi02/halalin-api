module.exports = {
    root: true,
    env: {
        commonjs: true,
        es2021: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: "latest"
    },
    extends: ["eslint:recommended", "prettier"],
    plugins: [],
    ignorePatterns: ["bin/*", "node_modules/*"],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "no-unused-vars": "off"
    }
}
