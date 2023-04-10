// Description: Main file for the web server
// Author: Rúben Príncipe
// Date: 16/09/2022
// Version: 1.0.0
// Usage: yarn start

//Imports
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const Login = require("./auth/Login");
const InvalidRoutes = require("./auth/InvalidRoutes");
const path = require("path");
const app = express();

//Middlewares and settings

app.use(express.json());
app.use(cookieParser());

//Routes

app.get("/login", function (req, res) {
	Login.authenticateTokenLoginPage(req, res);
	res.sendFile(path.join(__dirname + "/public/html/login/index.html"));
});

app.post("/login", async function (req, res) {
	Login.login(req, res);
});

app.get("/logout", (req, res) => {
	Login.deleteRefreshToken(req, res);
});

app.get("/", Login.authenticateToken, function (req, res) {
	res.sendFile(path.join(__dirname + "/private/index.html"));
});

//Invalidated routes

app.get("/html/login", function (req, res) {
	InvalidRoutes.main(req, res);
});

app.get("/html/login/index.html", function (req, res) {
	InvalidRoutes.main(req, res);
});

//Static Files

app.use(express.static("public"));
app.use(Login.authenticateToken, express.static("private"));

//Invalid routes

app.get("*", function (req, res) {
	InvalidRoutes.main(req, res);
});

//Server

app.listen(process.env.PORT, process.env.IPADDR, function () {
	console.log("Server listening on port: " + process.env.PORT);
});

/*
.env file
# Server
ACCESS_TOKEN_SECRET='255655ced18fc28cf1767d0fa866a093934eca1d640ac1341881cf4caf07b5c64e0f4f8904aa308b0609534e99a99360ae3bd6d1f12ad11e22f95a7bd4c228f9'
REFRESH_TOKEN_SECRET='e329364d145ab60fad8ab4945f2c7bb5edde9235f90611453dc80f6d4c34f848073a7996c77f5ac34e9181b66dca5f9198c5aa995588e88207afc2af0d5e3abf'
TOKEN_VALIDITY='15m'
REFRESH_TOKEN_VALIDITY='24h'
COOKIE_AGE='86400000' #24h
DEF_USERNAME='admin'
DEF_PASSWORD='admin'
CRED_PATH='./raspberryfi.auth'
IPADDR='0.0.0.0'
PORT='80'
*/
