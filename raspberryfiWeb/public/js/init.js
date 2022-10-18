const auth = new Auth();

try {
	document.querySelector(".logout").addEventListener("click", (e) => {
		auth.logOut();
	});
} catch (err) {
	//console.log(err);
	//console.log("Error: Logout button not available!");
}
