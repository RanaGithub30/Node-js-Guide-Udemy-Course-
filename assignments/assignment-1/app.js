/**
 * create two routes - / and /users
 * 
 * a) write a greeting text in / route & add a input field called username & console the result 
 * b) display dummy user lists in / route
*/

const http = require('http');
const res = require('./routes');

const server = http.createServer(res);
server.listen(3000);