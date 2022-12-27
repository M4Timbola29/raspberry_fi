require("dotenv").config();
const auth = require("./Auth");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
const cookieAge = process.env.COOKIE_AGE;

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
		return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: process.env.REFRESH_TOKEN_VALIDITY,
		});
	}

	authenticateToken(req, res, next) {
		const token = req.cookies.jwt;
		if (token == null) return res.status(401).redirect("/login");

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(403).redirect("/login");
			req.user = user;
			return next();
		});
	}
	authenticateTokenLoginPage(req, res) {
		const token = req.cookies.jwt;
		const refreshToken = req.cookies.refreshToken;
		if (token == null && refreshToken == null) return;

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				if (refreshToken != null) {
					this.refreshToken(req, res);
				}
				return;
			}
			req.user = user;
			res.status(200).redirect("/");
		});
	}

	refreshToken(req, res) {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken == null) return res.status(401).redirect("/logout");
		if (!refreshTokens.includes(refreshToken))
			return res.status(403).redirect("/logout");
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(403).redirect("/logout");
			const token = jwt.sign(
				{ name: user.name },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: process.env.TOKEN_VALIDITY,
				}
			);
			res
				.cookie("jwt", token, {
					httpOnly: true,
					maxAge: cookieAge,
				})
				.status(200)
				.redirect("/");
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
