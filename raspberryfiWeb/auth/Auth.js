require("dotenv").config({ path: "../.env" });
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = process.env.CREDPATH;

class Auth {
	constructor() {}
	async init(formUsername, formPassword) {
		try {
			const main = await this.main(formUsername, formPassword);
			if (main) {
				//return token
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.log("Error initializing authentication!");
		}
	}
	async main(formUsername, formPassword) {
		try {
			const { usernameHash, passwordHash } = await this.getFileData();
			if (usernameHash != null && passwordHash != null) {
				const bool = await this.credCompare(
					usernameHash,
					passwordHash,
					formUsername,
					formPassword
				);
				if (bool) {
					return true;
				} else {
					return false;
				}
			} else {
				const newUserHash = await this.hashGen(process.env.DEF_USERNAME);
				const newPassHash = await this.hashGen(process.env.DEF_PASSWORD);

				const bool = await this.writeFile(newUserHash + "\n" + newPassHash).then(
					async () => {
						try {
							const bool = await this.credCompare(
								newUserHash,
								newPassHash,
								formUsername,
								formPassword
							);
							if (bool) {
								return true;
							} else {
								return false;
							}
						} catch (err) {
							console.error("Error getting file data!");
							//console.error(err);
						}
					},
					function (err) {
						console.error("Error writing new data!");
						//console.error(err);
					}
				);
				if (bool) {
					return true;
				} else {
					return false;
				}
			}
		} catch (error) {
			console.log("Error getting file data!");
			//console.error(error);
		}
	}
	getFileData() {
		return new Promise((resolve, reject) => {
			this.checkFileExists().then(
				function () {
					fs.readFile(path, { encoding: "utf-8" }, function (err, data) {
						if (!err) {
							const formatedData = data.split(/\r?\n/);
							const usernameHash = formatedData[0];
							const passwordHash = formatedData[1];
							resolve({ usernameHash, passwordHash });
						} else {
							console.error("Error reading file data!");
							reject(err);
						}
					});
				},
				function (err) {
					console.error("Error getting file!", err);
					reject(err);
				}
			);
		});
	}
	writeFile(data) {
		return new Promise((resolve, reject) => {
			this.checkFileExists().then(
				function () {
					fs.writeFile(path, data, (err) => {
						if (err) {
							console.log("Error writing new data!");
							reject(err);
						} else {
							resolve();
						}
					});
				},
				function (err) {
					console.error("Error getting file data!");
					reject(err);
				}
			);
		});
	}
	checkFileExists() {
		return new Promise((resolve, reject) => {
			try {
				if (fs.existsSync(path)) {
					resolve();
				} else {
					fs.open(path, "wx", function (err, fd) {
						if (err) {
							console.error("Error opening the file!");
							reject(err);
						} else {
							fs.close(fd, function (err) {
								if (err) {
									console.error("Error closing the file!");
									reject(err);
								} else {
									resolve();
								}
							});
						}
					});
				}
			} catch (err) {
				console.error("Error getting the file!");
				reject(err);
			}
		});
	}
	async credCompare(usernameHash, passwordHash, formUsername, formPassword) {
		try {
			const userIsMatch = await bcrypt.compare(formUsername, usernameHash);
			const passIsMatch = await bcrypt.compare(formPassword, passwordHash);
			if (userIsMatch && passIsMatch) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.error("Error comparing credentials!");
			return false;
		}
	}
	async hashGen(cred) {
		const secret = await this.secretGen();
		const hash = await bcrypt.hash(cred, secret);
		return hash;
	}
	async secretGen() {
		const newSecret = await bcrypt.genSalt(10);
		return newSecret;
	}
}

const auth = new Auth();

module.exports = auth;
