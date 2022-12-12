const loginPath = "/html/login/";
const homePath = "/";
const currentPath = window.location.pathname;

class Auth {
	logOut() {
		localStorage.removeItem("autorization");

		if (currentPath != loginPath) {
			window.location.replace(loginPath);
		}
	}
}
