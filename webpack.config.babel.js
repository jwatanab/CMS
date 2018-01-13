import webpack from 'webpack'

export default {
    context: __dirname + '/src',
    entry: {
        javascript: './main.js',
    },

    output: {
        path: __dirname + '/pub',
        filename: 'bundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },
        ],
        devtool: '#source-map'
    }
}