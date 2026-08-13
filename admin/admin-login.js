


/* =====================================================
   CHECK IF ALREADY LOGGED IN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (session) {

            window.location.href =
                "dashboard.html";

        }

    }
);


/* =====================================================
   LOGIN FORM
===================================================== */

const loginForm =
    document.getElementById(
        "adminLoginForm"
    );


const loginStatus =
    document.getElementById(
        "loginStatus"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "adminEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "adminPassword"
                    )
                    .value;


            const originalButtonText =
                loginButton.innerHTML;


            try {

                loginButton.disabled = true;

                loginButton.innerHTML =
                    "Signing In...";


                loginStatus.textContent =
                    "";

                loginStatus.className =
                    "login-status";


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    throw error;

                }


                loginStatus.textContent =
                    "Login successful. Redirecting...";


                loginStatus.className =
                    "login-status success";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginStatus.textContent =
                    error.message ||
                    "Unable to sign in. Please try again.";


                loginStatus.className =
                    "login-status error";


                loginButton.disabled =
                    false;


                loginButton.innerHTML =
                    originalButtonText;

            }

        }
    );

}


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const passwordInput =
    document.getElementById(
        "adminPassword"
    );


if (
    togglePassword &&
    passwordInput
) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "Hide";

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "Show";

            }

        }
    );

}