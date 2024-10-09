const http = require('http'); // this code import the http module
const routes = require('./routes');

// setup the server
const server = http.createServer(routes);
server.listen(3000);