var express = require('express');
var app = express();

app.use(express.static('raspberryfiWeb'));

var server = app.listen(80);