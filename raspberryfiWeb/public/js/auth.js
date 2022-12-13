const loginPath = "/html/login/";
const homePath = "/";
const currentPath = window.location.pathname;

class Auth {
	logOut() {
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("refreshToken");
	}
}
