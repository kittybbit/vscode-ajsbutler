const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const path = require('path');

// const outputFilename = 'extension.js';

module.exports = (env, argv) => {
    const PRODUCTION = argv.mode === 'production';
    const DEVELOPMENT = argv.mode !== 'production';
    return [{
        mode: argv.mode ?? 'development',
        target: 'web',
        devtool: PRODUCTION ? false : 'inline-source-map',
        entry: {
            'index': './src/component/editor/index.tsx',
        },
        output: {
            path: path.join(__dirname, 'out'),
            filename: '[name].js',
            libraryTarget: 'umd',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
            alias: {
                '@resource': path.join(__dirname, "src/resource/"),
            }
        },
        stats: {
            orphanModules: true,
            errorDetails: true,
        },
        module: {
            rules: [
                // Allow importing ts(x) files:
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        configFile: 'tsconfig.json',
                        // transpileOnly enables hot-module-replacement
                        transpileOnly: true,
                        compilerOptions: {
                            // Overwrite the noEmit from the client's tsconfig
                            noEmit: false,
                            target: 'ES2022',
                        },
                    },
                },
            ],
        },
        optimization: {
            innerGraph: true,
            usedExports: true,
            mangleExports: 'size',
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 2020,
                        warnings: DEVELOPMENT,
                        compress: {
                            ecma: 2020,
                            drop_console: PRODUCTION,
                            drop_debugger: PRODUCTION,
                        },
                    },
                }),
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    tsconfig: 'tsconfig.json',
                },
            }),
            new DefinePlugin({
                DEVELOPMENT: DEVELOPMENT,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: '../report/index_report.html',
            }),
        ],
    }, {
        mode: argv.mode ?? 'development',
        target: 'node',
        devtool: PRODUCTION ? false : 'inline-source-map',
        entry: {
            'extension': './src/extension.ts',
        },
        output: {
            path: path.join(__dirname, 'out'),
            filename: '[name].js',
            libraryTarget: 'commonjs2',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
            alias: {
                '@resource': path.join(__dirname, "src/resource/"),
                '@generate': path.join(__dirname, "src/generate/"),
            }
        },
        externals: {
            vscode: 'commonjs vscode',
        },
        stats: {
            orphanModules: true,
            errorDetails: true,
        },
        module: {
            rules: [
                // Allow importing ts(x) files:
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        configFile: 'tsconfig.json',
                        // transpileOnly enables hot-module-replacement
                        transpileOnly: true,
                        compilerOptions: {
                            // Overwrite the noEmit from the client's tsconfig
                            noEmit: false,
                        },
                    },
                },
            ],
        },
        optimization: {
            usedExports: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 2020,
                        warnings: DEVELOPMENT,
                        compress: {
                            ecma: 2020,
                            drop_console: PRODUCTION,
                            drop_debugger: PRODUCTION,
                        },
                    },
                }),
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    tsconfig: 'tsconfig.json',
                },
            }),
            new DefinePlugin({
                DEVELOPMENT: DEVELOPMENT,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: '../report/extension_report.html',
            }),
        ],
    }];
};
