const routes = ["/", "/login", "/logout"];

class InvalidRoutes {
	constructor() {}

	main(req, res) {
		for (let i = 0; i < routes.length; i++) {
			if (req.path == routes[i]) {
				return;
			}
		}
		res.status(404).redirect("/login");
	}
}

const invalidRoutes = new InvalidRoutes();

module.exports = invalidRoutes;
