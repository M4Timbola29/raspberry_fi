class Login {
    
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
        this.errors = 0;
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
                `The fields cannot be empty!`,
                "error"
            );
            return false;
        } else {
            this.setStatus(field, null, "success");
        }
    }
    //status message fix
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
            console.log(this.errors);
        }
    }
}

const form = document.querySelector(".loginForm");

if (form) {
    const fields = ["username", "password"];
    const validator = new Login(form, fields);
}