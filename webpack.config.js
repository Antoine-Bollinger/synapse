const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const production = argv.mode === "production";

    return {
        mode: production ? "production" : "development",

        entry: "./src/client/ts/main.ts",

        output: {
            filename: "js/bundle.js",
            path: path.resolve(__dirname, "public"),
            clean: false
        },

        devtool: production ? false : "source-map",

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.client.json"
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },

        resolve: {
            extensions: [".ts", ".js"]
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/style.css"
            })
        ]
    };
};