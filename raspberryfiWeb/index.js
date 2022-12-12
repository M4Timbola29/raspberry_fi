const Login = require("./auth/Login");
const path = require("path");
const ipaddr = "0.0.0.0";
const port = 80;

const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

app.get("/html/login/", function (req, res) {
	res.sendFile(path.join(__dirname + "/public/html/login/index.html"));
});

app.post("/html/login", async function (req, res) {
	try {
		const accessToken = await Login.login(req.body).then((data) => {
			return data;
		});
		if (accessToken != null) {
			res.status(200).json({ accessToken: accessToken });
		} else {
			res.status(403).send("Invalid username or password!");
		}
	} catch (error) {
		console.log("Error sending authentication response!");
		res.status(403).send("Invalid username or password!");
	}
});

app.get("/", Login.authenticateToken, function (req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/", function (req, res) {});

app.use(express.static("public"));

app.listen(port, ipaddr, function () {
	console.log("Server listening on port: " + port);
});
