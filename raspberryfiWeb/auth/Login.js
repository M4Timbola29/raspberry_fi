const auth = require("./Auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let refreshTokens = [];

class Login {
	login(req, res) {
		return new Promise(async (resolve, reject) => {
			try {
				const username = req.body["username"];
				const password = req.body["password"];
				const authInit = await auth.init(username, password);

				if (authInit) {
					//send token
					const user = { name: username };
					const accessToken = this.generateAccessToken(user);
					const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
					refreshTokens.push(refreshToken);
					res.status(200).json({
						accessToken: accessToken,
						refreshToken: refreshToken,
					});
					resolve();
				} else {
					res.status(403).send("Invalid username or password!");
				}
			} catch (error) {
				console.log("Error sending authentication response!");
				reject();
			}
		});
	}

	generateAccessToken(user) {
		return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15m",
		});
	}

	refreshToken(req, res) {
		const refreshToken = req.body.refreshtoken;
		if (refreshToken == null) return res.sendStatus(401);
		if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{ name: user.name },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "15m",
				}
			);
			res.json({ accessToken: accessToken });
		});
	}

	authenticateToken(req, res, next) {
		const authHeader = req.headers["jwt"];
		const token = authHeader && authHeader.split(" ")[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	}

	deleteRefreshToken(req, res) {
		if (req.body.refreshtoken == null) return res.sendStatus(401);
		if (!refreshTokens.includes(req.body.refreshtoken))
			return res.sendStatus(403);
		const refreshToken = req.body.refreshtoken;
		refreshTokens = refreshTokens.filter(
			(refreshtoken) => refreshtoken !== refreshToken
		);
		res.status(200).send("Refresh token deleted!");
	}
}

const login = new Login();
module.exports = login;
