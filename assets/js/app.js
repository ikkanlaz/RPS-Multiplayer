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

function hideModalForSentInvitation() {
    $(".modal--invite-sent").css("display", "none");
}

function hideModalForInvitation() {
    $(".modal--invite").css("display", "none");
}

function loadGameScreen() {
    $("#rps-images").css("display", "block");
    $(".game-title").text("select one");
}

function removeInviteData() {
    var ref = firebase.database().ref();
    var opponentUid;
    var currentUserObj = firebase.auth().currentUser;

    var opponentQuery = ref.child("users/" + currentUserObj.uid + "/currentOpponentUid");
    opponentQuery.once("value", function (snapshot) {
        console.log(snapshot.val());
        opponentUid = snapshot.val();
    }).then(function () {
        console.log(opponentUid);
        database.ref('users/' + opponentUid).update({
            inviteReceived: false,
            inviteSent: false,
            currentOpponentUid: null
        }).then(function () {
            database.ref('users/' + currentUserObj.uid).update({
                inviteReceived: false,
                inviteSent: false,
                currentOpponentUid: null
            }).catch(function (error) {
                console.log("Unable to update opponents record" + error.message);
                addErrorModal(error.message);
            });
        }).catch(function (error) {
            console.log("Unable to update own record: " + error.message);
            addErrorModal(error.message);
        });
    });
}

function updateScore(keyToBeIncremented) {
    var opponentUid;
    var currentUserObj = firebase.auth().currentUser;
    console.log(keyToBeIncremented);

    var databaseRef = firebase.database().ref('users').child(currentUserObj.uid).child(keyToBeIncremented);
    console.log(databaseRef);
    databaseRef.transaction(function (keyToBeIncremented) {
        console.log(keyToBeIncremented);
        return (keyToBeIncremented || 0) + 1;
    }, function () {

    }).catch(function (error) {
        console.log("Unable to own record: " + error.message);
        addErrorModal(error.message);
    });
}

function displayResults(optionSelected, opponentOptionSelected) {

    // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate counter.
    if ((optionSelected === "rock") && (opponentOptionSelected === "scissors")) {
        updateScore("currentGameWins");
    }
    else if ((optionSelected === "rock") && (opponentOptionSelected === "paper")) {
        updateScore("currentGameLosses");
    }
    else if ((optionSelected === "scissors") && (opponentOptionSelected === "rock")) {
        updateScore("currentGameLosses");
    }
    else if ((optionSelected === "scissors") && (opponentOptionSelected === "paper")) {
        updateScore("currentGameWins");
    }
    else if ((optionSelected === "paper") && (opponentOptionSelected === "rock")) {
        updateScore("currentGameWins");
    }
    else if ((optionSelected === "paper") && (opponentOptionSelected === "scissors")) {
        updateScore("currentGameLosses");
    }
    else if (optionSelected === opponentOptionSelected) {
        updateScore("currentGameTies");
    }
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
        var inviteReceived = ref.child("users/" + currentUserObj.uid + "/inviteReceived");
        inviteReceived.on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === true) {
                displayInvitation();
            } else {
                console.log("hiding invitation modal");
                hideModalForInvitation();
            }
        });

        var inviteSent = ref.child("users/" + currentUserObj.uid + "/inviteSent");
        inviteSent.on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === true) {
                displayModalForSentInvitation();
            } else {
                console.log("hiding sent invitation modal");
                hideModalForSentInvitation();
            }
        });


        var inGame = ref.child("users/" + currentUserObj.uid + "/inGame");
        inGame.on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === true) {
                hideModalForSentInvitation();
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
});

$(document).on("click", "#accept-invitation-button", function () {
    $(this).parent().parent().css("display", "none");
    var ref = firebase.database().ref();
    var opponentUid;
    var currentUserObj = firebase.auth().currentUser;

    var opponentQuery = ref.child("users/" + currentUserObj.uid + "/currentOpponentUid");
    opponentQuery.once("value", function (snapshot) {
        console.log(snapshot.val());
        opponentUid = snapshot.val();
    }).then(function () {
        console.log(opponentUid);
        database.ref('users/' + currentUserObj.uid).update({
            inGame: true,
            inviteReceived: false,
            currentOpponentUid: opponentUid
        }).then(function () {
            database.ref('users/' + opponentUid).update({
                inGame: true,
                inviteSent: false
            }).catch(function (error) {
                console.log("Unable to update opponents record" + error.message);
                addErrorModal(error.message);
            });
        }).catch(function (error) {
            console.log("Unable to update own record: " + error.message);
            addErrorModal(error.message);
        });
        loadGameScreen();
    });

});

$(document).on("click", "#reject-invitation-button", function () {
    $(this).parent().parent().css("display", "none");
    removeInviteData();
});

$(document).on("click", "#cancel-invitation-button", function () {
    $(this).parent().parent().css("display", "none");
    removeInviteData();
});

$(document).on("click", ".rps-image", function () {
    var objectSelectedInput = $(this).data("option");
    var opponentOptionSelected;
    var opponentUid;
    var currentUserObj = firebase.auth().currentUser;
    var ref = firebase.database().ref();

    var opponentQuery = ref.child("users/" + currentUserObj.uid + "/currentOpponentUid");
    opponentQuery.once("value", function (snapshot) {
        console.log(snapshot.val());
        opponentUid = snapshot.val();
    }).then(function () {
        console.log(opponentUid);
        database.ref('users/' + currentUserObj.uid).update({
            optionSelected: objectSelectedInput
        }).then(function () {
            database.ref('users/' + opponentUid).update({
                opponentOptionSelected: objectSelectedInput
            }).catch(function (error) {
                console.log("Unable to update opponents record" + error.message);
                addErrorModal(error.message);
            });
        }).catch(function (error) {
            console.log("Unable to update option selected: " + error.message);
            addErrorModal(error.message);
        });
    });

    var opponentReady = ref.child("users/" + currentUserObj.uid + "/opponentOptionSelected");
    opponentReady.on("value", function (snapshot) {
        console.log(snapshot.val());
        opponentOptionSelected = snapshot.val();
        if (snapshot.val()) {
            displayResults(objectSelectedInput, opponentOptionSelected);
        }
    });

});