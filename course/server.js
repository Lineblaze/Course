const express = require('express'),
  hbs = require('hbs'),
  path = require('path'),
  routes = require('./routes/routes.js');


const port = process.env.PORT || 3000;

const app = express();
// Define paths for Express config
const publicDirectory = path.join(__dirname, '/public');
const viewsPath = path.join(__dirname, '/templates/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);

// Setup static directory to serve
app.use(express.static(publicDirectory));

app.listen(port, () => console.log('Server running on port ' + port));