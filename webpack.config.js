const path = require('path')
module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        auth: './src/auth.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname,
             'dist/bundles'),
        filename: '[name].bundle.js' 
    },
    watch: true
}