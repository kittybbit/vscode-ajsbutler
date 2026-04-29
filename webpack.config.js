/* eslint-disable @typescript-eslint/no-require-imports */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { DefinePlugin } = require("webpack");
const { ProvidePlugin } = require("webpack");
const path = require("path");
const dotenv = require("dotenv");

const parsedEnv = dotenv.config().parsed ?? {};
const OUTPUT_PATH = path.join(__dirname, "out");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css"];
const BASE_ALIAS = {
    "@resource": path.join(__dirname, "src/resource/"),
};
const BASE_STATS = {
    orphanModules: true,
    errorDetails: true,
};
const BASE_CACHE = {
    type: "filesystem",
};
const CONNECTION_STRING = parsedEnv.connection_string ?? "";
const EXTENSION_ALIAS = {
    "@generate": path.join(__dirname, "src/generate/"),
};
const EXTENSION_DEFINE_VALUES = (development) => ({
    DEVELOPMENT: JSON.stringify(development),
    CONNECTION_STRING: JSON.stringify(CONNECTION_STRING),
});

const getBuildFlags = (argv) => {
    const mode = argv.mode ?? "development";
    const production = mode === "production";
    return {
        mode,
        production,
        development: !production,
    };
};

const createTsRule = (compilerOptions = {}) => ({
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
    options: {
        configFile: "tsconfig.json",
        transpileOnly: true,
        compilerOptions: {
            noEmit: false,
            ...compilerOptions,
        },
    },
});

const createOptimization = (production, development) => ({
    innerGraph: true,
    usedExports: true,
    minimize: production,
    minimizer: production
        ? [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    warnings: development,
                    compress: {
                        drop_console: production,
                        drop_debugger: production,
                    },
                },
            }),
        ]
        : [],
});

const createAnalyzerPlugin = (enabled, reportFilename) => (enabled
    ? [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename,
        }),
    ]
    : []);

const createBasePlugins = ({ defineValues, production, analyzer, reportFilename, extraPlugins = [] }) => [
    ...(production
        ? [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    tsconfig: "tsconfig.json",
                },
            }),
        ]
        : []),
    new DefinePlugin(defineValues),
    ...extraPlugins,
    ...createAnalyzerPlugin(analyzer, reportFilename),
];

const createConfig = ({
    mode,
    production,
    development,
    target,
    entry,
    libraryType,
    aliases = {},
    externals,
    tsCompilerOptions,
    extraRules = [],
    defineValues,
    analyzer,
    reportFilename,
    extraPlugins = [],
    fallback,
}) => ({
    mode,
    target,
    devtool: production ? false : "inline-source-map",
    entry,
    output: {
        path: OUTPUT_PATH,
        filename: "[name].js",
        library: {
            type: libraryType,
        },
    },
    resolve: {
        extensions: EXTENSIONS,
        alias: {
            ...BASE_ALIAS,
            ...aliases,
        },
        ...(fallback ? { fallback } : {}),
    },
    externals,
    cache: BASE_CACHE,
    stats: BASE_STATS,
    module: {
        rules: [createTsRule(tsCompilerOptions), ...extraRules],
    },
    optimization: createOptimization(production, development),
    plugins: createBasePlugins({
        defineValues,
        production,
        analyzer,
        reportFilename,
        extraPlugins,
    }),
});

const createExtensionConfig = ({
    mode,
    production,
    development,
    target,
    entry,
    externals,
    extraPlugins = [],
    fallback,
    reportFilename,
    analyzer,
}) => createConfig({
    mode,
    production,
    development,
    target,
    entry,
    libraryType: "commonjs2",
    aliases: EXTENSION_ALIAS,
    externals,
    defineValues: EXTENSION_DEFINE_VALUES(development),
    analyzer,
    reportFilename,
    extraPlugins,
    fallback,
});

const editorConfig = (env, argv) => {
    const { mode, production, development } = getBuildFlags(argv);
    return createConfig({
        mode,
        production,
        development,
        target: "web",
        entry: {
            tableViewer: "./src/ui-component/editor/tableViewer.tsx",
            flowViewer: "./src/ui-component/editor/flowViewer.tsx",
        },
        libraryType: "umd",
        externals: {
            vscode: "commonjs vscode",
        },
        tsCompilerOptions: {
            target: "ES2022",
        },
        extraRules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
        defineValues: {
            DEVELOPMENT: JSON.stringify(development),
        },
        analyzer: !!env.analyzer,
        reportFilename: "../report/editor_report.html",
    });
};

const nodeConfig = (env, argv) => {
    const { mode, production, development } = getBuildFlags(argv);
    return createExtensionConfig({
        mode,
        production,
        development,
        target: "node",
        entry: {
            extension: "./src/extension.ts",
        },
        externals: {
            vscode: "commonjs vscode",
            os: "commonjs os",
            "node:crypto": "commonjs crypto",
            assert: "commonjs assert",
            util: "commonjs util",
        },
        analyzer: !!env.analyzer,
        reportFilename: "../report/extension_report.html",
    });
};

const webConfig = (env, argv) => {
    const { mode, production, development } = getBuildFlags(argv);
    return createExtensionConfig({
        mode,
        production,
        development,
        target: "webworker",
        entry: {
            web: "./src/extension.ts",
        },
        externals: {
            vscode: "commonjs vscode",
        },
        analyzer: !!env.analyzer,
        reportFilename: "../report/web_report.html",
        extraPlugins: [
            new ProvidePlugin({
                process: "process/browser",
            }),
        ],
        fallback: {
            assert: require.resolve("assert"),
            os: require.resolve("os-browserify/browser"),
            util: require.resolve("util"),
            path: require.resolve("path-browserify"),
        },
    });
};

module.exports = (env, argv) => {
    return [editorConfig(env, argv), nodeConfig(env, argv), webConfig(env, argv)];
};
