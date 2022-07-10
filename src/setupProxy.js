const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

    app.use("/api/self-service",
        createProxyMiddleware({
            target: 'https://auth.api.dev.mindtastic.lol',
            changeOrigin: true,
        })
    );

    app.use("/api/sessions",
        createProxyMiddleware({
            target: 'https://auth.api.dev.mindtastic.lol',
            changeOrigin: true,
        })
    );

    app.use("/api/wiki",
        createProxyMiddleware({
            target: 'https://wiki.api.dev.mindtastic.lol',
            changeOrigin: true,
        })
    );

    app.use("/api/user",
        createProxyMiddleware({
            target: 'https://users.api.dev.mindtastic.lol',
            changeOrigin: true,
        })
    );
}