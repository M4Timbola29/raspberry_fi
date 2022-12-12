const auth = require("./auth/Auth");
const path = require("path");
const ipaddr = "0.0.0.0";
const port = 80;

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

require("dotenv").config();

app.use(express.json());

app.get("/html/login/", function (req, res) {
	res.sendFile(path.join(__dirname + "/public/html/login/index.html"));
});

app.post("/html/login", function (req, res) {
	async function login(data) {
		const formatedData = JSON.stringify(data).split(",");
		const username = formatedData[0].split(":")[1];
		const password = formatedData[1].split(":")[1];
		const formUsername = username.substring(1, username.length - 1);
		const formPassword = password.substring(1, password.length - 2);
		const authInit = await auth.init(formUsername, formPassword);
		try {
			if (authInit) {
				//send token
				tokenContent = { name: formUsername };
				const accecssToken = jwt.sign(
					tokenContent,
					process.env.ACCESS_TOKEN_SECRET
				);
				res.status(200).json({ accessToken: accecssToken });
			} else {
				res.status(401).send("Authentication failed!");
			}
		} catch (error) {
			console.log("Error sending authentication response!");
		}
	}
	login(req.body);
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

app.get("/", authenticateToken, function (req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/", function (req, res) {});

app.use(express.static("public"));

app.listen(port, ipaddr, function () {
	console.log("Server listening on port: " + port);
});
