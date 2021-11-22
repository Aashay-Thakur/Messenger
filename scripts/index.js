// For Modal Box
const accountDetails = document.querySelector(".account-details");
const loggedInLinks = document.querySelectorAll(".logged-in");
const loggedOutLinks = document.querySelectorAll(".logged-out");

document.addEventListener("DOMContentLoaded", (e) => {
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);

    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});

const setupUserData = (userData, user) => {
    document.querySelector(".sidebar-image").setAttribute("src", userData.photoURL);
    document.querySelector(".user-name").innerHTML = user.displayName;
    const html = `
    <div class="center avatar avc">
        <img class="img-responsive blob circle z-depth-1-half gradient-45deg-purple-deep-orange" id="account-photo" style="height: 150px; width: 150px;" src="${userData.photoURL}" alt="">
        <div class="edit-container modal-trigger" data-target="modal-profile-picture">
            <i class="material-icons prefix">edit</i>
        </div>
    </div>
    <div>Username: <b>${userData.displayName}</b></div>
    <div id="userEmail">Email: <b>${userData.emailAddress}</b></div>
    <div>Phone: <b>+91 ${userData.phoneNumber}</b></div>
    <div>Email Verified: <b>${user.emailVerified ? "Yes" : "No"}</b></div>
    `;
    $(".account-name").html(`<h5 class="ml-4">${userData.displayName}</h5><p class="ml-4 bio"><em>${userData.bioLine ? userData.bioLine : "One Line Bio"}</em></p>`);
    accountDetails.innerHTML = html;
    document.querySelectorAll(".user-name").innerHTML = userData.displayName;
    $(".info-text").html(userData.bioLine ? userData.bioLine : "One Line Bio");
    //   var avatars = document.querySelectorAll(".chat-left>.chat-avatar");
    //   avatars.forEach((e) => {
    //     e.innerHTML = `
    //         <a class="avatar">
    //             <img src="${user.photoURL}" class="circle z-depth-1" alt="avatar">
    //         </a>`;
    //   });
};

const snackbar = (message) => {
    const snackbar = document.getElementById("snackbar");

    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
        snackbar.innerHTML = "";
    }, 3000);
};
const groupHTML = (groupName, groupMessage, groupImage, messageTime, groupId) => {
    const users = `
    <div class="chat-user animate fadeUp delay-1 ${groupName.trim().toLowerCase().replace(" ", "_")}" id="${groupId}">
    <div class="user-section">
        <div class="row valign-wrapper">
            <div class="col s2 media-image online pr-0" style="width: 55px;">
                <img src="${groupImage}" alt="" class="circle z-depth-2 responsive-img" />
            </div>
            <div class="col s10">
                <p class="m-0 blue-grey-text text-darken-4 font-weight-700">${groupName}</p>
                <p class="m-0 info-text">${groupMessage}</p>
            </div>
        </div>
    </div>
    <div class="info-section">
        <div class="star-timing">
            <div class="time">
                <span>${messageTime}</span>
            </div>
        </div>
    </div>
    </div>
    `;

    document.querySelector(".chat-list").innerHTML += users;
};

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        if (e.ctrlKey) {
            document.querySelector("textarea").value += "\n";
        } else {
            e.preventDefault();
            $("#chat-form").submit();
            $("#chat-message").val = "";
        }
    }
});

$(".chat-footer")
    .on("change keydown keyup paste cut focus blur", "textarea", function () {
        $(this)
            .height(0)
            .height(this.scrollHeight - 28);
        if ($(this).height() == 60) {
            $("textarea#chat-message").css("overflow", "auto");
        } else {
            $("textarea#chat-message").css("overflow", "hidden");
        }
    })
    .find("textarea#chat-message")
    .change();

const setupMessages = (messageContent, messageTime, isRecieved) => {
    // messageContent - the actual message sent,
    // messageTime - the time it was sent,
    // isRecieved - boolean, true if it is a recieved message, and not sent by user, these go to the left side of the chat box.
    let chatBoxHTML = "";
    if (isRecieved) {
        console.log("Recieved");
        if (document.querySelector(".chats").childElementCount != 0) {
            console.log("Not Empty");
            if (document.querySelector(".chats").lastElementChild.classList.contains("chat-left")) {
                console.log("Last Element is Left");
            }
            if (document.querySelector(".chats").lastElementChild.classList.contains("chat-right")) {
                console.log("Last Element is Right");
            }
        } else console.log("Empty");
    }
    if (!isRecieved) {
        console.log("Sent");
        if (document.querySelector(".chats").childElementCount != 0) {
            console.log("Not Empty");
            if (document.querySelector(".chats").lastElementChild.classList.contains("chat-right")) {
                console.log("Last Element is Right");
            }
            if (document.querySelector(".chats").lastElementChild.classList.contains("chat-left")) {
                console.log("Last Element is Left");
            }
        } else console.log("Empty");
    }
};
