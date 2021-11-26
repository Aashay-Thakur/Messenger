import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { getFirestore, setDoc, serverTimestamp, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setupUserData(docSnap.data(), user);
                setupGroups(docSnap.data(), user);
            } else {
                snackbar("User not found!");
            }
        });
    }
});

const setupGroups = (userData, user) => {
    userData.messageGroups.forEach(async (group) => {
        var docSnap = await getDoc(doc(db, "groups", group));
        if (docSnap.exists()) {
            var recipientUID = docSnap.data().members.filter((value) => {
                return value != user.uid;
            });
            var userName = await getDoc(doc(db, "users", recipientUID.toString()));
            var groupData = docSnap.data();
            var userData = userName.data();
            let dateString = "";
            let message = "";
            if (groupData.lastMessageTime != null) {
                let d = new Date(groupData.lastMessageTime.toDate());
                dateString = d.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
                message = groupData.lastMessage;
            }
            groupHTML(userData.displayName, message, userData.photoURL, dateString, group.toString());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
};

// Log Out

let logOutButtons = document.querySelectorAll("#logout");
logOutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        signOut(auth)
            .then(() => {
                location.replace("../user-login.html");
            })
            .catch((err) => {
                console.error(err);
            });
    });
});
