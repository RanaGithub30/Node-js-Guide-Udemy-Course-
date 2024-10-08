const http = require('http'); // this code import the http module
const fs = require('fs'); // access the file module

// setup the server
const server = http.createServer((req, res) => {
    // way of set response 
     res.setHeader('content-type', 'text/html');

     // accessing request url
     const url = req.url;
     const method = req.method;

     if(url === '/message'){
        res.write('<html>');
        res.write('<head><body><form action="/message-submit" method="POST"><h1>Submit A Message Form</h1><br><input type="text" name="message"><button type="submit">Submit</button></form></body></head>');
        res.write('</html>');
        return res.end();
     }

    /**
     * execute if url is message-submit && method is post
    */

    if(url === '/message-submit' && method == "POST"){
            // create a new event for when data is submitted
              const body = [];
             req.on('data', (chunk) => [
                 body.push(chunk),
                 console.log(chunk),
             ]);
             req.on('end', () => {
                 const parsedBody = Buffer.concat(body).toString(); // Combine all chunks in the `body` array and convert the Buffer to a string
                 const message = parsedBody.split('=')[1];
                 fs.writeFileSync('message.txt', message); // create a new file and write the message within the file
             });

             res.statusCode = 302;
             res.setHeader('Location', '/');
             return res.end();
    }

     // this way we can write html content within response
     res.write('<html>');
     res.write('<head><body><h1>This is A test from Node.js Tutorial</body></head>');
     res.write('</html>');
     res.end();

});

server.listen(3000);