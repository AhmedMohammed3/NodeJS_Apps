const http = require('http');

const routes = require('./routes');

console.log(routes.started);
const server = http.createServer(routes.requestHandler);

server.listen(1234);
