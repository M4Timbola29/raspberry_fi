const sha256 = require("crypto-js/sha256");

class Auth {
	constructor() {}
	init() {
		var encrypted = sha256("admin");
		console.log(encrypted);
	}
}