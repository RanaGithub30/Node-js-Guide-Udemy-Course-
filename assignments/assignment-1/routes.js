const assignDatas = (req, res) => {
      const url = req.url;
      const method = req.method;

      res.setHeader('content-type', 'text/html');
      if(url == '/'){
            res.write('<html><body>');
            res.write('<h1>Welcome to the Node Assignment - 01</h1>');
            res.write('<form action="/create-user" method="POST"><input type="text" name="username" placeholder="Enter Username"><button type="submit">Submit</button></form>');
            res.write('</body></html>');
            return res.end();
        }
        if(url == '/users'){
          res.write('<html><body>');
          res.write('<h1>List of Users</h1>');
          res.write('<ul><li>User-1</li>');
          res.write('<li>User-2</li>');
          res.write('<li>User-3</li>');
          res.write('<li>User-4</li>');
          res.write('<li>User-5</li></ul>');
          res.write('</body></html>');
          return res.end();
      }

      // handle the post request
      if(url === '/create-user' && method == 'POST'){
           const body = [];
           req.on('data', (chunk) => {
                body.push(chunk);
           });
           req.on('end', () => {
                const finalRes = Buffer.concat(body).toString();
                const userName = finalRes.split('=')[1];
                console.log(userName);
           });

           res.setHeader('Location', '/');
           return res.end();
      }

      res.end();
}

module.exports = assignDatas;