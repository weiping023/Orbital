var express = require('express');
var app = express();
var path = require('path');


app.use(express.static(path.join(__dirname + '/frontend')));

require('./backend/routes.js')(app); //import route
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
    console.log('http://localhost:3000/');
});