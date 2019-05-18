const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        counter: `${__dirname}/examples/counter/index.tsx`,
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: 'source-map-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader', options: {
                        useTranspileModule: true,
                        isolatedModules: true,
                        transpileOnly: true,
                    }
                }
            },
            {
                test: /index\.html$/,
                use: [
                    { loader: 'html-loader', options: { minimize: false } },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            'react-clax': `${__dirname}/src/index`,
        }
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/examples/counter/index.html`,
            filename: 'counter.html',
        })
    ]
}
