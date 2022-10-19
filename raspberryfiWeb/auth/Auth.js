const bcrypt = require("bcrypt");
const fs = require("fs");

const defUsername = "admin";
const defPassword = "admin";

const path = "./raspberryfi.auth";

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
			const { username, hash } = await this.getFileData();
			if (username != null && hash != null) {
				const bool = await this.credCompare(
					username,
					hash,
					formUsername,
					formPassword
				);
				if (bool) {
					return true;
				} else {
					return false;
				}
			} else {
				const newSecret = await this.secretGen();
				const newHash = await this.hashGen(defPassword, newSecret);

				const bool = await this.writeFile(defUsername + "\n" + newHash).then(
					async () => {
						try {
							const bool = await this.credCompare(
								defUsername,
								newHash,
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
							console.error(err);
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
							const username = formatedData[0];
							const hash = formatedData[1];
							resolve({ username, hash });
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
	async credCompare(username, hash, formUsername, formPassword) {
		try {
			const isMatch = await bcrypt.compare(formPassword, hash);
			if (isMatch && username == formUsername) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.error("Error comparing credentials!");
			return false;
		}
	}
	async hashGen(password, secret) {
		const hash = await bcrypt.hash(password, secret);
		return hash;
	}
	async secretGen() {
		const newSecret = await bcrypt.genSalt(10);
		return newSecret;
	}
}

const auth = new Auth();

module.exports = auth;
