class Login {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
    }

    validateonSubmit() {
        let self = this;

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            var error = 0;
            self.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                console.log(input.value);
                if (self.validateFields(input) == false) {
                    error++;
                }
            });
            if (error == 0) {
                //write to file and localstorage
                localStorage.setItem("auth", 1);
                this.form.submit();
            }
        });
    }
    validateFields(field) {
        if (field.value.trim() === "") {
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} The fields cannot be empty!`,
                "error"
            );
            return false;
        } else {
            if (field.type == "password") {
                if (field.value.length < 8) {
                    this.setStatus(
                        field,
                        `${field.previousElementSibling.innerText} Password must be at least 8 characters long!`,
                        "error"
                    );
                    return false;
                } else {
                    this.setStatus(field, null, "success");
                    return true;
                }
            } else {
                this.setStatus(field, null, "success");
                return true;
            }
        }
    }
    setStatus(field, message, status) {
        const errorMessage = field.parentElement.querySelector(".errorMessage");

        if (status == "success") {
            if (errorMessage) {
                errorMessage.innerText = "";
            }
            field.classList.remove("inputError");
        }

        if (status == "error") {
            errorMessage.innerText = message;
            field.classList.add("inputError");
        }
    }
}

const form = document.querySelector(".loginForm");

if (form) {
    const fields = ["username", "password"];
    const validator = new Login(form, fields);
}