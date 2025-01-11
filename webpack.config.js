const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const { ProvidePlugin } = require('webpack');
const path = require('path');

const editorConfig = (env, argv) => {
    const PRODUCTION = argv.mode === 'production';
    const DEVELOPMENT = !PRODUCTION;
    return {
        mode: argv.mode ?? 'development',
        target: 'web',
        devtool: PRODUCTION ? false : 'inline-source-map',
        entry: {
            'ajsTable/index': './src/ui-component/editor/ajsTable/index.tsx',
            'ajsFlow/index': './src/ui-component/editor/ajsFlow/index.tsx',
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
        externals: {
            vscode: 'commonjs vscode',
        },
        cache: {
            type: 'filesystem',
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
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ],
                },
            ],
        },
        optimization: {
            innerGraph: true,
            usedExports: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        warnings: DEVELOPMENT,
                        mangle: PRODUCTION,
                        compress: {
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
                'DEVELOPMENT': JSON.stringify(DEVELOPMENT),
            }),
            ...(env.analyzer ? [new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: '../report/index_report.html',
            })] : []),
        ],
    }
};

const nodeConfig = (env, argv) => {
    const PRODUCTION = argv.mode === 'production';
    const DEVELOPMENT = !PRODUCTION;
    return {
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
            },
        },
        externals: {
            vscode: 'commonjs vscode',
            os: 'commonjs os',
            'node:crypto': 'commonjs crypto',
            assert: 'commonjs assert',
            util: 'commonjs util',
        },
        cache: {
            type: 'filesystem',
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
            innerGraph: true,
            usedExports: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        warnings: DEVELOPMENT,
                        mangle: PRODUCTION,
                        compress: {
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
                'DEVELOPMENT': JSON.stringify(DEVELOPMENT),
            }),
            ...(env.analyzer ? [new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: '../report/extension_report.html',
            })] : []),
        ],
    }
};

const webconfig = (env, argv) => {
    const PRODUCTION = argv.mode === 'production';
    const DEVELOPMENT = !PRODUCTION;
    const nodeCfg = nodeConfig(env, argv);
    return {
        ...nodeCfg,
        ...{
            target: 'webworker',
            entry: {
                'web': './src/extension.ts',
            },
            resolve: {
                ...nodeCfg.resolve,
                fallback: {
                    assert: require.resolve('assert'),
                    os: require.resolve('os-browserify/browser'),
                    util: require.resolve('util'),
                }
            },
            externals: {
                vscode: 'commonjs vscode',
            },
            plugins: [
                nodeCfg.plugins[0],
                nodeCfg.plugins[1],
                new ProvidePlugin({
                    process: 'process/browser',
                }),
                ...(env.analyzer ? [new BundleAnalyzerPlugin({
                    analyzerMode: "static",
                    openAnalyzer: false,
                    reportFilename: '../report/web_report.html',
                })] : []),
            ]
        }
    }
};

module.exports = (env, argv) => {
    return [
        editorConfig(env, argv),
        nodeConfig(env, argv),
        webconfig(env, argv)
    ];
};
