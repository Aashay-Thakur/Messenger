import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
// Checking Auth state, contains the user token, for some reason currentUser doesn't work.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        let userData;
        /*Get User Data, listening for snapshot changes in user data
        This is because the group is created on server, but the userdata is not updated locally.
        And if the same recipient email is added again, it creates a new group
        This way userData updates when a new group is created.
        The problem with this is that the data is only retrieved when a snapshot changes, which means this is not good for collecting static data*/
        const unsubscribeSnapshotListener = onSnapshot(doc(db, "users", user.uid), (doc) => {
            userData = doc.data();
        });
        // Call unsubscibeSnapshotListener() to stop listening for snapshot events

        // Add group form event
        const addContact = document.querySelector("#add-form");
        document.querySelector(".add-error").innerHTML = "";
        addContact.addEventListener("submit", async (e) => {
            const searchEmail = addContact["add-email"].value;

            e.preventDefault();
            document.querySelector(".add-error").innerHTML = "";
            if (searchEmail == user.email) {
                //Closes materialize Modal
                M.Modal.getInstance(document.getElementById("modal-add")).close();
                snackbar("Can not add your Mail");
                addContact.reset();
            }
            // Checking if Recipient email exists in users database
            if (searchEmail != user.email) {
                const q = query(collection(db, "users"), where("emailAddress", "==", searchEmail), where("emailAddress", "!=", user.email));
                const querySnapshot = await getDocs(q);
                // if it does exist, get the recipient user data
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const recipientData = doc.data();
                        if (!checkGroups(userData, recipientData)) {
                            // Create a new group and update the recipient and user data
                            createMessageGroup(user, recipientData);
                            document.querySelector(".chat-list").innerHTML = "";
                            snackbar("User Added!");
                        } else {
                            snackbar("Group Already Exists!");
                        }
                        document.querySelector(".add-error").innerHTML = "";
                        addContact.reset();
                        const modal = document.querySelector("#modal-add");
                        M.Modal.getInstance(modal).close();
                    });
                }
                // if firebase returns null, it means the user does not exists
                if (querySnapshot.empty) {
                    document.querySelector(".add-error").innerHTML = "User not found";
                }
            }
        });
        const picForm = document.getElementById("profile-pic-form");
        picForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            // getting the selected profile pic, since each pic is a radio button, I call for the sibling <img> of the checked radio button.
            //! Since it uses firstElement Child and nextElementSibling for this, the order of the HTML tags is important.
            var photoAddr = document.querySelector('input[name="profile-pictures"]:checked').nextElementSibling.firstElementChild.getAttribute("src");
            updateProfile(user, {
                photoURL: photoAddr,
            });
            updateDoc(doc(db, "users", user.uid), {
                photoURL: photoAddr,
            }).then(() => {
                M.Modal.getInstance(document.querySelector("#modal-profile-picture")).close();
                M.Modal.getInstance(document.querySelector("#modal-account")).close();
                location.reload();
            });
        });
    }
});
// Checks if the group array in both recipientData and userData are not empty and don't have the same groups
// In layman's term, checks if the group is already created or not
const checkGroups = (userData, recipientData) => {
    if (userData.messageGroups.length != 0 && recipientData.messageGroups.length != 0) {
        return userData.messageGroups.some((group) => recipientData.messageGroups.includes(group));
    } else return false;
};
const createMessageGroup = async (user, recipient) => {
    const docRef = await addDoc(collection(db, "groups"), {
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid, recipient.firebaseUID],
    });
    await updateDoc(doc(db, "users", user.uid), {
        messageGroups: arrayUnion(docRef.id),
    });
    await updateDoc(doc(db, "users", recipient.firebaseUID), {
        messageGroups: arrayUnion(docRef.id),
    });
    await setDoc(doc(db, "messages", docRef.id), {});
};
