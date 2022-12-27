try {
	$("#link-gameServers").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Game Servers");
		$(".content").load("/html/gameServers/index.html");

		window.history.pushState("string", "gameServers", "/gameServers");
	});

	$("#link-settings").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Settings");
		$(".content").load("/html/settings/index.html");

		window.history.pushState("string", "settings", "/settings");
	});

	$(() => {
		switch (window.location.pathname) {
			case "/gameServers":
				$(".content").load("/html/gameServers/index.html");
				break;
			case "/settings":
				$(".content").load("/html/settings/index.html");
				break;
			default:
				break;
		}
	});
} catch (error) {
	//console.log(error);
}
