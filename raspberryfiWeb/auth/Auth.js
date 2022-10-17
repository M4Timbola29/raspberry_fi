const bcrypt = require("bcrypt");
const fs = require("fs");

//get from form
let username = "admin";
let password = "admin";

let secret = null;
let hash = null;
const path = "./raspberryfi.auth";

class Auth {
	constructor() {}
	init() {
		this.main();
	}
	async main() { 
		await this.getFileData()
		//not waiting
		console.log(username);
		console.log(hash);
		console.log(secret);

		if (username != null && secret != null && hash != null) {
			//credCompare();
			console.log("compare");
		} else {
			secret = await this.secretGen();
			hash = await this.hashGen(password, secret);
			await this.writeFile(username + "\n" + hash + "\n" + secret);
			//credCompare();
		}
	}
	async getFileData() {
		let bool = await this.checkFileExists();
		try {
			if (bool == true) {
				fs.readFile(path, { encoding: "utf-8" }, function (err, data) {
					if (!err) {
						const formatedData = data.split(/\r?\n/);
						username = formatedData[0];
						hash = formatedData[1];
						secret = formatedData[2];
					}
				});
			}
		} catch (error) {
			console.error("Error getting file data!");
		}
	}
	async writeFile(data) {
		let bool = await this.checkFileExists();
		if (bool == true) {
			fs.writeFile(path, data, (err) => {
				if (err) console.log("Error writing new data!");
				else {
					return;
				}
			});
		} else {
			console.log("Error getting file data!");
		}
	}
	async checkFileExists() {
		try {
			if (fs.existsSync(path)) {
				return true;
			} else {
				try {
					fs.open(path, "wx", function (err, fd) {
						//handle error
						fs.close(fd, function (err) {
							//handle error
						});
					});
					return true;
				} catch (error) {
					console.error("Error creating the file!");
					return false;
				}
			}
		} catch (err) {
			console.error("Error getting the file!");
			return false;
		}
	}
	async credCompare() {
		//get username
		//get password
		//get secret
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
