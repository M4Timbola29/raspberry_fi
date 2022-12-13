const Login = require("./auth/Login");
const path = require("path");
const ipaddr = "0.0.0.0";
const port = 80;

const express = require("express");
const app = express();

app.use(express.json());

app.get("/html/login/", function (req, res) {
	res.sendFile(path.join(__dirname + "/public/html/login/index.html"));
});

app.post("/html/login", async function (req, res) {
	Login.login(req, res);
});

app.post("/token", (req, res) => {
	Login.refreshToken(req, res);
});

app.delete("/logout", (req, res) => {
	Login.deleteRefreshToken(req, res);
});

app.get("/", Login.authenticateToken, function (req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/", function (req, res) {});

app.use(express.static("public"));

app.listen(port, ipaddr, function () {
	console.log("Server listening on port: " + port);
});
