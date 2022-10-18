const bcrypt = require("bcrypt");
const fs = require("fs");

const defUsername = "admin";
const defPassword = "admin";

let formUsername = null;
let formPassword = null;

const path = "./raspberryfi.auth";

class Auth {
	constructor() {}
	init() {
		//get formusername and formpassword from index.js
		//not working
		console.log(formUsername, formPassword);
		this.main();
	}
	async main() {
		try {
			const { username, secret, hash } = await this.getFileData();
			if (username != null && secret != null && hash != null) {
				const bool = await this.credCompare(username, hash);
				if (bool) {
					//give token
					console.log("Authentication successful!");
					return true;
				} else {
					console.log("Authentication failed!");
					return false;
				}
			} else {
				const newSecret = await this.secretGen();
				const newHash = await this.hashGen(defPassword, newSecret);

				this.writeFile(defUsername + "\n" + newHash + "\n" + newSecret).then(
					async function () {
						const bool = await this.credCompare(username, hash);
						if (bool) {
							//give token
							console.log("Authentication successful!");
						} else {
							console.log("Authentication failed!");
						}
					},
					function (err) {
						console.error(err);
					}
				);
			}
		} catch (error) {
			console.error(error);
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
							const secret = formatedData[2];
							resolve({ username, hash, secret });
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
	async credCompare(username, hash) {
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
