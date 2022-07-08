const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/options.js',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].options.js',
        path: path.resolve(__dirname, 'dist'),
        clean: false,
    },
};