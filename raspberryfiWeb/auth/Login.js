require("dotenv").config();
const auth = require("./Auth");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
const cookieAge = 1000 * 60 * 60 * 24 * 7;

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
					const refreshToken = this.generateRefreshToken(user);
					refreshTokens.push(refreshToken);
					res
						.cookie("jwt", accessToken, {
							httpOnly: true,
							maxAge: cookieAge,
						})
						.cookie("refreshToken", refreshToken, {
							httpOnly: true,
							maxAge: cookieAge,
						})
						.status(200)
						.send("Login successful!");
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
			expiresIn: process.env.TOKEN_VALIDITY,
		});
	}
	generateRefreshToken(user) {
		return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	}

	authenticateToken(req, res, next) {
		const token = req.cookies.jwt;
		if (token == null) return res.status(401).redirect("/login");

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(403).redirect("/login");
			req.user = user;
			next();
		});
	}
	authenticateTokenLoginPage(req, res) {
		const token = req.cookies.jwt;
		if (token == null) return;

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return;
			req.user = user;
			res.status(200).redirect("/");
		});
	}

	refreshToken(req, res) {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken == null) return res.sendStatus(401);
		if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{ name: user.name },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: process.env.TOKEN_VALIDITY,
				}
			);
			res
				.cookie("jwt", accessToken, {
					httpOnly: true,
					maxAge: cookieAge,
				})
				.status(200)
				.send("Cookie refreshed!");
		});
	}

	deleteRefreshToken(req, res) {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken == null) {
			return res
				.cookie("jwt", "", { maxAge: 0 })
				.cookie("refreshToken", "", { maxAge: 0 })
				.status(401)
				.redirect("/login");
		}
		if (!refreshTokens.includes(refreshToken)) {
			return res
				.cookie("jwt", "", { maxAge: 0 })
				.cookie("refreshToken", "", { maxAge: 0 })
				.status(403)
				.redirect("/login");
		}
		try {
			refreshTokens = refreshTokens.filter(
				(refreshtoken) => refreshtoken !== refreshToken
			);
		} catch (error) {
			console.log("Error deleting refresh token!");
		}
		res
			.cookie("jwt", "", { maxAge: 0 })
			.cookie("refreshToken", "", { maxAge: 0 })
			.status(200)
			.redirect("/login");
	}
}

const login = new Login();
module.exports = login;
