const loginPath = "/html/login/";
const homePath = "/";
const currentPath = window.location.pathname;

class Auth {
    constructor() {
        //document.querySelector("body").style.display = "none";
        const auth = localStorage.getItem("auth");
        this.validateAuth(auth);
    }
    validateAuth(auth) {
        //verify valid login
        if (auth != 1) {
            if (currentPath != loginPath) {
                window.location.replace(loginPath);
            }
            document.querySelector("body").style.display = "block";
        } else {
            if (currentPath != homePath) {
                window.location.replace(homePath);
            }
            document.querySelector("body").style.display = "block";
        }
    }
    logOut() {
        localStorage.removeItem("auth");

        if (currentPath != loginPath) {
            window.location.replace(loginPath);
        }
    }
}