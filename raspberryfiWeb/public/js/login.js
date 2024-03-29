class Login {
	constructor(form, fields) {
		this.form = form;
		this.fields = fields;
		this.errors = 0;
		this.host = host;
		this.loginPath = loginPath;
		this.validateonSubmit();
	}

	validateonSubmit() {
		let self = this;
		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			var error = 0;
			this.errors = 0;
			self.fields.forEach((field) => {
				const input = document.querySelector(`#${field}`);
				if (self.validateFields(input) == false) {
					error++;
				}
			});
			if (error == 0) {
				const username = document.querySelector(`#${self.fields[0]}`).value;
				const password = document.querySelector(`#${self.fields[1]}`).value;

				this.createPostRequest(this.host + this.loginPath, {
					username,
					password,
				}).then(
					(response) => {
						try {
							if (response == "Login successful!") {
								this.form.submit();
							} else {
								this.setStatus(
									document.querySelector(`#${self.fields[0]}`),
									`Invalid username or password`,
									"error"
								);
							}
						} catch (error) {}
					},
					(error) => {
						console.error("Error:", error);
					}
				);
			}
		});
	}

	createPostRequest(url, data) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onload = () => resolve(xhr.responseText);
			xhr.onerror = () => reject(xhr.statusText);
			xhr.send(JSON.stringify(data));
		});
	}
	validateFields(field) {
		if (field.value.trim() === "") {
			this.setStatus(field, `The fields cannot be empty!`, "error");
			return false;
		} else {
			this.setStatus(field, null, "success");
		}
	}
	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector(".errorMessage");
		if (status == "success" && this.errors == 0) {
			if (errorMessage) {
				errorMessage.innerText = "";
			}
		}
		if (status == "error") {
			errorMessage.innerText = message;
			this.errors++;
		}
	}
}

const form = document.querySelector(".loginForm");

if (form) {
	const fields = ["username", "password"];
	const validator = new Login(form, fields);
}
