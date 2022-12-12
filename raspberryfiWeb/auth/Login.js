const auth = require("./Auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class Login {
	login(data) {
		return new Promise(async (resolve, reject) => {
			const formatedData = JSON.stringify(data).split(",");
			const username = formatedData[0].split(":")[1];
			const password = formatedData[1].split(":")[1];
			const formUsername = username.substring(1, username.length - 1);
			const formPassword = password.substring(1, password.length - 2);
			const authInit = await auth.init(formUsername, formPassword);
			try {
				if (authInit) {
					//send token
					const tokenContent = { name: formUsername };
					const accessToken = jwt.sign(
						tokenContent,
						process.env.ACCESS_TOKEN_SECRET
					);
					resolve(accessToken);
				} else {
					console.log("Error sending authentication response!");
					reject();
				}
			} catch (error) {
				console.log("Error sending authentication response!");
				reject();
			}
		});
	}
	authenticateToken(req, res, next) {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	}
}

const login = new Login();
module.exports = login;
