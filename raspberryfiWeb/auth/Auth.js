import SHA256 from "crypto-js/sha256";

class Auth {
	constructor() {}
	init() {
		var encrypted = SHA256("Admin");
		console.log(encrypted);
	}
}

export default Auth