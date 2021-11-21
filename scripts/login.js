import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
const auth = getAuth();

// Log In
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rememberMe = document.querySelector("#rememberMe").checked;
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    if (!rememberMe) {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then((cred) => {
                        document.querySelector(".error-html").innerHTML = "";
                        window.location.replace("../index.html");
                    })
                    .catch((err) => {
                        document.querySelector(".error-html").innerHTML = err.message;
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                document.querySelector(".error-html").innerHTML = "";
                window.location.replace("../index.html");
            })
            .catch((err) => {
                document.querySelector(".error-html").innerHTML = err.message;
            });
    }
});
