const path = require('path');

const apimock = require('@ng-apimock/core');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.set('port', 9999);

const mocksDirectory = path.join(require.resolve('@ng-apimock/test-application'), '..', 'mocks');

apimock.processor.process({ src: mocksDirectory });
app.use(apimock.middleware);
app.use('/', express.static(path.join(require('@ng-apimock/test-application'))));

app.use('/orgs/ng-apimock', createProxyMiddleware({
    target: 'https://api.github.com',
    changeOrigin: true,
    timeout: 5000,
}));

app.use('/ng-apimock', createProxyMiddleware({
    target: 'https://raw.githubusercontent.com',
    changeOrigin: true
}));

app.listen(app.get('port'), () => {
    console.log('@ng-apimock/core running on port', app.get('port'));
    console.log('@ng-apimock/test-application is available under /');
});
