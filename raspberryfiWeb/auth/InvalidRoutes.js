class InvalidRoutes {
	constructor() {}

	main(req, res) {
		res.status(404).redirect("/login");
	}
}

const invalidRoutes = new InvalidRoutes();

module.exports = invalidRoutes;
