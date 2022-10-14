const Auth = require('./auth/Auth')

var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(80);

console.log(Auth);