const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = (env, argv) => {
    const production = argv.mode === "production";

    return {
        mode: production ? "production" : "development",

        target: "node",

        entry: "./src/server/app.ts",

        externals: [nodeExternals()],

        output: {
            filename: "app.js",
            path: path.resolve(__dirname, "api"),
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
                            configFile: "tsconfig.server.json"
                        }
                    },
                    exclude: /node_modules/
                }
            ]
        },

        resolve: {
            extensions: [".ts", ".js"]
        }
    };
};