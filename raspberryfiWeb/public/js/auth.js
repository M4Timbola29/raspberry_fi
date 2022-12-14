class Auth {
	constructor() {
		this.jwt = localStorage.getItem("jwt");
		this.refreshToken = localStorage.getItem("refreshToken");
		this.host = host;
		this.homePath = homePath;
		this.main();
	}
	main() {
		if (this.jwt != null) {
			this.createGetRequest(this.host + this.homePath);
		}
	}
	createGetRequest(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.setRequestHeader("jwt", this.jwt);
			xhr.onload = () => resolve(xhr.responseText);
			xhr.onerror = () => reject(xhr.statusText);
			xhr.send();
		});
	}
	logOut() {
		localStorage.removeItem("jwt");
		localStorage.removeItem("refreshToken");
	}
}
