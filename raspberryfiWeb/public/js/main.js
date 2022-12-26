try {
	$("#link-settings").on("click", (e) => {
		e.preventDefault();

		$("#dynamicName").text("Settings");
		$(".content").load("/html/settings/index.html");

		window.history.pushState("string", "settings", "/settings");
	});

	$(() => {
		switch (window.location.pathname) {
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
