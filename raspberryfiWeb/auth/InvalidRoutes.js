const mainRoutes = ["/", "/login", "/logout"];
const invalidatedRoutes = [
	"/index.html",
	"/html/login",
	"/html/login/index.html",
];

class InvalidRoutes {
	constructor() {}

	main(req, res) {
		res.status(404).redirect("/login");
	}
}

const invalidRoutes = new InvalidRoutes();

module.exports = invalidRoutes;
