module.exports = function override(config, env) {
    config.resolve.fallback = {
        "querystring": require.resolve("querystring-es3"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
    }
    return config
}