module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es2022": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "settings": {
        "react": {
            "version": "18.2.0"
        }
    },
    "ignorePatterns": ["webpack.config.js", "**/generate/**/*.ts"],
    "rules": {
        "no-restricted-imports": [
            "error",
            {
                "patterns": ["@mui/*/*/*"]
            }
        ]
    }
}
