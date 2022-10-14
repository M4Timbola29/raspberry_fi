const auth = require('./auth/Auth')
var path = require('path');
const port = 80

var express = require('express');
var app = express();

app.get('/html/login/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/html/login/index.html'));
    auth.init();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static('public'));

var server = app.listen(port);
console.log("Running on port: ", port);