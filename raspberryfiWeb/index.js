require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const Login = require("./auth/Login");
const InvalidateRoutes = require("./auth/InvalidRoutes");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cookieParser());

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

app.use(express.static("public"));

app.get("*", function (req, res) {
	InvalidateRoutes.main(req, res);
});

app.listen(process.env.PORT, process.env.IPADDR, function () {
	console.log("Server listening on port: " + process.env.PORT);
});
