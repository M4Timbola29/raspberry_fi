const auth = require("./auth/Auth");
const path = require("path");
const port = 80;

const express = require("express");
const app = express();

app.get("/html/login/", function (req, res) {
	res.sendFile(path.join(__dirname + "/public/html/login/index.html"));
});

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/html/login", function (req, res) {
	req.on("data", async function (data) {
		const formatedData = data.toString().split(",");
		const username = formatedData[0].split(":")[1];
		const password = formatedData[1].split(":")[1];
		const formUsername = username.substring(1, username.length - 1);
		const formPassword = password.substring(1, password.length - 2);
		const authInit = await auth.init(formUsername, formPassword);

		try {
			if (authInit) {
				//send token
				res.status(200).send("Authentication successful!");
			} else {
				res.status(401).send("Authentication failed!");
			}
		} catch (error) {
			console.log("Error sending authentication response!");
		}
	});
});

app.use(express.static("public"));

app.listen(port, function () {
	console.log("Server listening on port: " + port);
});
