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

	$("#link-firewall").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Firewall");
		$(".content").load("/html/firewall/index.html");

		window.history.pushState("string", "firewall", "/firewall");
	});

	$("#link-ftp").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("FTP");
		$(".content").load("/html/ftp/index.html");

		window.history.pushState("string", "ftp", "/ftp");
	});

	$("#link-openVPN").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("OpenVPN");
		$(".content").load("/html/openVPN/index.html");

		window.history.pushState("string", "openVPN", "/openVPN");
	});

	$("#link-docker").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Docker");
		$(".content").load("/html/docker/index.html");

		window.history.pushState("string", "docker", "/docker");
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
			case "/firewall":
				$(".content").load("/html/firewall/index.html");
				break;
			case "/ftp":
				$(".content").load("/html/ftp/index.html");
				break;
			case "/openVPN":
				$(".content").load("/html/openVPN/index.html");
				break;
			case "/docker":
				$(".content").load("/html/docker/index.html");
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
