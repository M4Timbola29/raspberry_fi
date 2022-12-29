try {
	$("#link-dashboard").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Dashboard");
		$(".content").load("/html/dashboard/index.html");

		window.history.pushState("string", "dashboard", "/dashboard");
	});

	$("#link-wireless").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Wireless");
		$(".content").load("/html/wireless/index.html");

		window.history.pushState("string", "wireless", "/wireless");
	});

	$("#link-dhcp").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("DHCP");
		$(".content").load("/html/dhcp/index.html");

		window.history.pushState("string", "dhcp", "/dhcp");
	});

	$("#link-openVPN").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("OpenVPN");
		$(".content").load("/html/openVPN/index.html");

		window.history.pushState("string", "openVPN", "/openVPN");
	});

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
			case "/dashboard":
				$(".content").load("/html/dashboard/index.html");
				break;
			case "/wireless":
				$(".content").load("/html/wireless/index.html");
				break;
			case "/dhcp":
				$(".content").load("/html/dhcp/index.html");
				break;
			case "/openVPN":
				$(".content").load("/html/openVPN/index.html");
				break;
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
