const auth = new Auth();

try {
    document.querySelector(".logout").addEventListener("click", (e) => {
        auth.logOut();
    });
} catch (error) {
    console.log("Error: Logout button not available!");
}