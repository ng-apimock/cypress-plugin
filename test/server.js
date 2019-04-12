const apimock = require('@ng-apimock/core');
const connect = require('connect');
const path = require('path');
const serveStatic = require('serve-static');
const app = connect();
const mocksDirectory = path.join(require.resolve('@ng-apimock/test-application'), '..', 'mocks');

apimock.processor.process({src: mocksDirectory});
app.use(apimock.middleware);
app.use('/', serveStatic(path.join(require('@ng-apimock/test-application'))));
app.use('/items', function (request, response, next) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    if (request.method === 'GET') {
        response.end('["passThrough"]');
    } else if (request.method === 'POST') {
        response.end('["passThrough"]');
    } else {
        next();
    }
});
app.listen(9900);
console.log('ng-apimock-angular-test-app is running on port 9900');