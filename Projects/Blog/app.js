const express = require('express');
const path = require('path');
const app = express();

// const adminRoute = require('./routes/admin');
// const frontRoute = require('./routes/front');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

// app.use(adminRoute);
// app.use(frontRoute);
app.listen(3000);