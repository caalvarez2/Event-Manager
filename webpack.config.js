const path = require('path')
module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        auth: './src/auth.js',
        login: './src/login.js',
        management: './src/management.js',
        seating: './src/seating.js'
    },
    output: {
        path: path.resolve(__dirname,
             'dist/bundles'),
        filename: '[name].bundle.js',
        clean: true,  
    },
    watch: true
}