module.exports = {
    "extends": [
        "airbnb",
        "plugin:flowtype/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "modules": true
        }
    },
    "plugins": [
        "flowtype"
    ],
    "rules": {
        "semi": [1, 'never'],
        "react/jsx-filename-extension": [1, { "extensions": [".jsx", ".js"] }]
    }
};
