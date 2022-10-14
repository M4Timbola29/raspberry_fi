import Auth from "./auth/Auth"

const auth = new Auth();

var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(80);

auth.init();