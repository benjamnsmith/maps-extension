const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].popup.js',
        path: path.resolve(__dirname, 'dist'),
        clean: false,
    },
};