
document.addEventListener("DOMContentLoaded", () => {

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    const message = document.getElementById("authMessage");

    // SIGNUP
    if (signupForm) {

        signupForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const userData = {
                name: document.getElementById("name").value.trim(),
                username: document.getElementById("username").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value
            };

            try {

                await apiRequest("/auth/signup", "POST", userData);

                message.textContent = "Account created successfully!";
                message.style.color = "green";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } catch (error) {

                message.textContent = error.message;
                message.style.color = "red";

            }

        });

    }

    // LOGIN
    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const loginData = {
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value
            };

            try {

                const result = await apiRequest(
                    "/auth/login",
                    "POST",
                    loginData
                );

                localStorage.setItem("vyntra_token", result.token);

                localStorage.setItem(
                    "vyntra_user",
                    JSON.stringify(result.user)
                );

                window.location.href = "index.html";

            } catch (error) {

                message.textContent = error.message;
                message.style.color = "red";

            }

        });

    }

});
