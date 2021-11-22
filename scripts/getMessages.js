import { getFirestore, getDocs, collection, query } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        $(".chat-list").on("click", "> *", async function () {
            const q = query(collection(db, "messages/" + $(this).attr("id") + "/conversation"));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data().sentBy.trim() != user.uid) {
                    setupMessages(doc.data().messageContent, doc.data().timeSent, true);
                }
                if (doc.data().sentBy.trim() == user.uid) {
                    setupMessages(doc.data().messageContent, doc.data().timeSent, false);
                }
            });
        });
    }
});
