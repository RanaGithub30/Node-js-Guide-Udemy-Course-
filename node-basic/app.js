const http = require('http'); // this code import the http module

// setup the server
const server = http.createServer((req, res) => {
    console.log("Here is Test Server from Node");
});

server.listen(3000);