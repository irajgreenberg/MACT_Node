
const path = require("path");

module.exports = {
    // entry: "./src/p5/proj01/sketch.ts",
    //entry: "./src/p5/CryptoIra/sketch.ts",
    //entry: "./src/p5/CryptoIra02/sketch.ts",
    //entry: "./src/p5/CryptoIra03/sketch.ts",
    // entry: "./src/p5/CryptoIra04/sketch.ts",
    //entry: "./src/p5/CryptoManDataCollector/sketch.ts",
    entry: "./src/p5/VerletDemo_01/sketch.ts",

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 8080
    },
    externals: {
        p5: 'p5'//
    }
};