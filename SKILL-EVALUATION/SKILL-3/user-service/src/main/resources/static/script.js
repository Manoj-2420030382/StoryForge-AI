const API_BASE_URL = "http://localhost:8084";


/* =========================
   PASSWORD VISIBILITY
========================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "Hide";

    } else {

        input.type = "password";

        button.textContent = "Show";
    }
}


/* =========================
   MESSAGE
========================= */

function showMessage(elementId, message, type) {

    const element = document.getElementById(elementId);

    element.textContent = message;

    element.className = `message ${type}`;
}


function clearMessage(elementId) {

    const element = document.getElementById(elementId);

    element.textContent = "";

    element.className = "message";
}


/* =========================
   FIELD ERROR
========================= */

function setFieldError(fieldId, message) {

    const element = document.getElementById(fieldId);

    if (element) {
        element.textContent = message;
    }
}


function clearFieldErrors() {

    document
        .querySelectorAll(".field-error")
        .forEach(element => {
            element.textContent = "";
        });
}


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearFieldErrors();

            clearMessage("registerMessage");


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            let valid = true;


            /* Username */

            if (!username) {

                setFieldError(
                    "usernameError",
                    "Username is required"
                );

                valid = false;

            } else if (username.length < 3) {

                setFieldError(
                    "usernameError",
                    "Username must be at least 3 characters"
                );

                valid = false;
            }


            /* Email */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!email) {

                setFieldError(
                    "emailError",
                    "Email is required"
                );

                valid = false;

            } else if (!emailPattern.test(email)) {

                setFieldError(
                    "emailError",
                    "Enter a valid email address"
                );

                valid = false;
            }


            /* Password */

            if (!password) {

                setFieldError(
                    "passwordError",
                    "Password is required"
                );

                valid = false;

            } else if (password.length < 6) {

                setFieldError(
                    "passwordError",
                    "Password must be at least 6 characters"
                );

                valid = false;
            }


            /* Confirm Password */

            if (!confirmPassword) {

                setFieldError(
                    "confirmPasswordError",
                    "Please confirm your password"
                );

                valid = false;

            } else if (password !== confirmPassword) {

                setFieldError(
                    "confirmPasswordError",
                    "Passwords do not match"
                );

                valid = false;
            }


            if (!valid) {
                return;
            }


            const button =
                document.getElementById("registerButton");


            button.disabled = true;

            button.textContent = "Creating Account...";


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json()
                        .catch(() => null);


                if (response.ok) {

                    showMessage(
                        "registerMessage",
                        "Account created successfully! Redirecting to login...",
                        "success"
                    );


                    registerForm.reset();


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1500);


                } else {

                    handleRegisterError(data);

                }

            } catch (error) {

                showMessage(
                    "registerMessage",
                    "Unable to connect to the server. Make sure Spring Boot is running on port 8084.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent = "Create Account";
            }

        }
    );
}


/* =========================
   REGISTER ERROR
========================= */

function handleRegisterError(data) {

    if (!data) {

        showMessage(
            "registerMessage",
            "Registration failed.",
            "error"
        );

        return;
    }


    if (data.username) {

        setFieldError(
            "usernameError",
            data.username
        );
    }


    if (data.email) {

        setFieldError(
            "emailError",
            data.email
        );
    }


    if (data.password) {

        setFieldError(
            "passwordError",
            data.password
        );
    }


    if (data.error) {

        const error =
            data.error.toLowerCase();


        if (error.includes("username")) {

            setFieldError(
                "usernameError",
                data.error
            );

        } else if (error.includes("email")) {

            setFieldError(
                "emailError",
                data.error
            );

        } else {

            showMessage(
                "registerMessage",
                data.error,
                "error"
            );
        }

    }
}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearFieldErrors();

            clearMessage("loginMessage");


            const username =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            let valid = true;


            if (!username) {

                setFieldError(
                    "loginUsernameError",
                    "Username is required"
                );

                valid = false;
            }


            if (!password) {

                setFieldError(
                    "loginPasswordError",
                    "Password is required"
                );

                valid = false;
            }


            if (!valid) {
                return;
            }


            const button =
                document.getElementById("loginButton");


            button.disabled = true;

            button.textContent = "Signing In...";


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username,
                                password
                            })
                        }
                    );


                const data =
                    await response.json()
                        .catch(() => null);


                if (response.ok) {

                    showMessage(
                        "loginMessage",
                        "Login successful! Welcome back.",
                        "success"
                    );

                } else {

                    showMessage(
                        "loginMessage",
                        data?.error ||
                        "Invalid username or password.",
                        "error"
                    );
                }


            } catch (error) {

                showMessage(
                    "loginMessage",
                    "Unable to connect to the server.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent = "Sign In";
            }

        }
    );
}