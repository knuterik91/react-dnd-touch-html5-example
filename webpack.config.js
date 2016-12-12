var path = require('path');
var webpack = require('webpack');
var merge = require('extendify')({ isDeep: true, arrays: 'concat' });
var devConfig = require('./webpack.config.dev');
var prodConfig = require('./webpack.config.prod');

//This is needed to ensure that HMR is deactivated in production!!
//Babel only listening to NODE_ENV.
process.env.NODE_ENV = process.env.ASPNETCORE_ENVIRONMENT;

if (process.env.ASPNETCORE_ENVIRONMENT === undefined) {
    process.env.ASPNETCORE_ENVIRONMENT = "Production";
    process.env.NODE_ENV = "Production";
}
var isProduction = process.env.ASPNETCORE_ENVIRONMENT === 'Production';
if (isProduction)
    console.log("Webpacking Production...");
else
    console.log("webpacking Development...");
module.exports = merge({
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.js(x?)$/, include: /ClientApp/, loader: 'babel' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    entry: {
        main: ['./ClientApp/main.js'],
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
    ]
}, isProduction ? prodConfig : devConfig);
