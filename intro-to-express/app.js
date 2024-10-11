const http = require('http'); // this code import the http module
const express = require('express');
const path = require('path');
const rootDir = require('./helpers/path');

/** Define routes files here */

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 
const bodyParser = require('body-parser'); // used for parsing data into the body object

const app = express(); // express returns a function

app.use(bodyParser.urlencoded({ extended: false }));

/** express.static() is middleware that serves static files (like images, CSS, JavaScript) from a specified directory.  */
app.use(express.static(path.join(__dirname, 'public')));

/** 
 * way to declare middleware in express
*/

// app.use((req, res, next) => {
//       console.log("Middleware - 01");
//       next(); // Allows the request to continue the next line of the middleware
// }); // This way we can define middleware in express

// app.use((req, res, next) => {
//       console.log("Middleware - 02");
//       res.send('<h1>Express Introduction</h1>'); // send the response in server & display the html in web
// }); // This way we can define middleware in express


/**
 * Like below way we can define multiple routes using express
*/


// app.use('/admin', adminRoutes); // we can add a prefix before rotes using this

app.use(adminRoutes);
app.use(shopRoutes);

/**
 * Add 404 page if any routes not found
*/

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, '../', 'views', 'errors', '404.html'));
    // res.status(404).send('<h1>Page Not Found</h1>');
});

// setup the server
app.listen(3000);