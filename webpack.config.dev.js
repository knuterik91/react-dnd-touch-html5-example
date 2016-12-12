var webpack = require('webpack');
module.exports = {
    debug: true,
    noInfo: false,
    devtool: 'inline-source-map',
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify("development"),
                ASPNETCORE_ENVIRONMENT: JSON.stringify("development")

            }
        })
    ]
};
