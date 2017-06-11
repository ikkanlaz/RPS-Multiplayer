var database = firebase.database();

function addUserToOnlineList(user) {
    var row = $("<tr>");
    row.addClass("user-row");
    row.attr("data-uid", user.key);
    var userName = $("<td>");
    userName.addClass("table-data");
    userName.text(user.child("username").val());
    var onlineStatus = $("<td>");
    onlineStatus.addClass("table-data");
    if (user.child("inGame").val() === true) {
        onlineStatus.text("In A Game");
    } else {
        onlineStatus.text("Available");
    }
    row.append(userName);
    row.append(onlineStatus);
    $("#user-list").append(row);
}

function addUserPromptModal(message) {
    $(".error-message").text(message);
    $(".modal--error").css("display", "block");
}

function displayInvitation() {
    $(".modal--invite").css("display", "block");
}

function displayModalForSentInvitation() {
    $(".modal--invite-sent").css("display", "block");
}

function hideInvitationModal() {
    $(".modal--invite-sent").css("display", "none");
    $(".modal--invite").css("display", "none");
}

function loadGameScreen() {
    $("#rps-images").css("display", "block");
    $(".game-title").text("select one");
}


// var ref = firebase.database().ref();
// var currentUserObj = firebase.auth().currentUser;
// console.log(currentUserObj);
// var users = ref.child("users");
// users.once("value", function (snapshot) {
//     snapshot.forEach(function (user) {
//         if (user.child("online").val() === true && firebase.auth().currentUser.uid !== user.key) {
//             $(".user-row").empty();
//             addUserToOnlineList(user);
//         }
//     });
// });
// // var invite = ref.child("users/" + firebase.auth().currentUser.uid + "/inviteSent");
// ref.child("users/" + firebase.auth().currentUser.uid + "/inviteSent").on("value", function (snapshot) {
//     console.log(snapshot.value);
//     if (snapshot.value === true) {
//         $(".modal--invite").css("display", "block");
//     }
// })


firebase.auth().onAuthStateChanged(function (currentUserObj) {
    if (currentUserObj) {
        var ref = firebase.database().ref();
        var currentUserObj = firebase.auth().currentUser;
        console.log(currentUserObj);
        var users = ref.child("users");
        users.once("value", function (snapshot) {
            snapshot.forEach(function (user) {
                if (user.child("online").val() === true && currentUserObj.uid !== user.key) {
                    $(".user-row").empty();
                    addUserToOnlineList(user);
                }
            });
        });
        var invite = ref.child("users/" + currentUserObj.uid + "/inviteReceived");
        invite.on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === true) {
                displayInvitation();
            }
        });

        var inGame = ref.child("users/" + currentUserObj.uid + "/inGame");
        inGame.on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === true) {
                hideInvitationModal();
                loadGameScreen();
            }
        });
    } else {
        console.log("Not logged in");
        if (window.location.pathname === "/RPS-Multiplayer/rps.html") {
            window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/index.html");
        }
    }
});

// var usersRef = database.ref('users');
// usersRef.on('value', function(snapshot){

// })

$(document).on("click", ".user-row", function () {
    var opponentUid = $(this).data("uid");
    var userObj = firebase.auth().currentUser;

    database.ref('users/' + userObj.uid).update({
        currentOpponentUid: opponentUid
    }).then(function () {
        database.ref('users/' + opponentUid).update({
            currentOpponentUid: userObj.uid,
            inviteReceived: true
        }).then(function () {
            displayModalForSentInvitation();
        }).catch(function (error) {
            console.log("Unable to update opponents record" + error.message);
            addErrorModal(error.message);
        });
    }).catch(function (error) {
        console.log("Unable to own record: " + error.message);
        addErrorModal(error.message);
    });





    //set a new field in db like inviteSent: true
    //validate that inGame and inviteSent are both false for this current user and selected user
    //set inviteSent to true for both
    //maybe set a timeout?
    //
});

$(document).on("click", "#accept-invitation-button", function () {
    $(this).parent().parent().css("display", "none");
    loadGameScreen();
});

$(document).on("click", "#reject-invitation-button", function () {
    $(this).parent().parent().css("display", "none");
    removeInviteData();
});

$(document).on("click", "#cancel-invitation-button", function () {
    $(this).parent().parent().css("display", "none");

});