import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { getFirestore, setDoc, serverTimestamp, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Sign up
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm["email"].value;
    const password = signupForm["password"].value;
    const firstNameField = signupForm["first_name"].value;
    const lastNameField = signupForm["last_name"].value;
    const displayNameField = signupForm["display_name"].value.trim();
    const phNumberField = parseInt(signupForm["phone"].value, 10);

    await createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            const user = cred.user;
            console.log(user);

            updateProfile(user, {
                displayName: displayNameField,
                phoneNumber: phNumberField,
                photoURL: "../resources/images/users/default/default-pic.jpg",
            });
            setDoc(doc(db, "users", user.uid), {
                firstName: firstNameField,
                lastName: lastNameField,
                messageGroups: [],
                displayName: displayNameField,
                emailAddress: email,
                phoneNumber: phNumberField,
                firebaseUID: user.uid,
                createdDate: serverTimestamp(),
                photoURL: "../resources/images/users/default/default-pic.jpg",
            })
                .then(() => {
                    signupForm.reset();
                    document.querySelector(".signup-error").innerHTML = "";
                    location.href = "../index.html";
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            console.error(err);
            var errMessage = "";
            // Catch and Display Errors while Signing up
            if (err.code === "auth/weak-password") {
                errMessage = "Password is too weak";
            }
            if (err.code === "auth/email-already-in-use") {
                errMessage = "Email is already In Use";
            } else {
                errMessage = "Some error occurred while signing up";
                console.log(err.code);
            }
            document.querySelector(".signup-error").innerHTML = errMessage;
        });
});
