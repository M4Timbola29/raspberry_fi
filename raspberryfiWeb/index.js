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
const InvalidateRoutes = require("./auth/InvalidRoutes");
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
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

//Invalidated routes

app.get("/html/login", function (req, res) {
	InvalidateRoutes.main(req, res);
});

app.get("/html/login/index.html", function (req, res) {
	InvalidateRoutes.main(req, res);
});

app.get("/index.html", function (req, res) {
	InvalidateRoutes.main(req, res);
});

//Static Files

app.use(express.static("public"));

//Invalid routes

app.get("*", function (req, res) {
	InvalidateRoutes.main(req, res);
});

//Server

app.listen(process.env.PORT, process.env.IPADDR, function () {
	console.log("Server listening on port: " + process.env.PORT);
});
