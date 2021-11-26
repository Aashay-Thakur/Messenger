import { getFirestore, getDocs, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
    // let messages = [];
    $(".chat-list").on("click", "> *", async function () {
        $(".chats").empty();
        const querySnapshot = getDocs(query(collection(db, "messages/" + $(this).attr("id") + "/conversation"), orderBy("timeSent", "asc"))).then((snap) => {
            snap.forEach((doc) => {
                let isRecieved = doc.data().sentBy.trim() != user.uid.trim();
                let d = new Date(doc.data().timeSent.toDate());
                let dateString = d.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
                setupMessages(doc.data().messageContent, dateString, isRecieved);
            });
        });
        // console.log(messages);
    });
});
