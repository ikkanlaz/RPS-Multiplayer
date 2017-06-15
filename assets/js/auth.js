
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCKKgtsfkMlM_CBPEsEx146nztNrPXUmNo",
    authDomain: "rps-multiplayer-2be45.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2be45.firebaseio.com",
    projectId: "rps-multiplayer-2be45",
    storageBucket: "rps-multiplayer-2be45.appspot.com",
    messagingSenderId: "1012669030451"
};
firebase.initializeApp(config);
var auth = firebase.auth();
var database = firebase.database();

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateUserName(email) {
    var re = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{2,15}$/;
    return re.test(email);
}

function validatePassword(password, passwordConfirm) {
    console.log(password.length);
    if (password.length >= 6 && password.length <= 20) {
        if (password === passwordConfirm) {
            return true;
        } else {
            addErrorModal("passwords do not match");
            return false;
        }
    } else {
        addErrorModal("passwords must be between 6 and 20 characters in length");
        return false;
    }
}

function writeUserData(userId, name) {
    console.log("attempting to add user data");
    console.log("userId: " + userId);
    console.log("name: " + name);
    firebase.database().ref('users/' + userId).set({
        username: name,
        online: true,
        inGame: false,
        inviteReceived: false,
        inviteSent: false,
        totalWins: 0,
        totalLosses: 0,
        currentOpponentUid: null,
        currentGameWins: 0,
        currentGameLosses: 0,
        optionSelected: "",
        opponentOptionSelected: ""
    }).then(function () {
        console.log("Adding user succeeded");
    }).catch(function (error) {
        console.log("Unable to add user: " + error.message);
        addErrorModal(error.message);
    });
}

function removeUserData(userId) {
    firebase.database().ref('users/' + userId).remove()
        .then(function () {
            console.log("Removing user succeeded");
        }).catch(function (error) {
            console.log("Unable to remove user: " + error.message);
            addErrorModal(error.message);
        });
}

function setOnlineStatus(userId, onlineStatus) {
    firebase.database().ref('users/' + userId).update({
        online: onlineStatus
    }).then(function () {
        console.log("setting user to online status to " + onlineStatus + " succeeded");

    }).catch(function (error) {
        console.log("Unable to change users online status: " + error.message);
        addErrorModal(error.message);
    });
}

function addErrorModal(message){
    $(".error-message").text(message);
    $(".modal--error").css("display", "block");
}

$("#btn-login").on("click", function () {
    event.preventDefault();
    var email = $("#txt-email").val().trim();
    var password = $("#txt-password").val().trim();
    if (validateEmail(email)) {
        var promise = auth.signInWithEmailAndPassword(email, password);
        promise.then(function () {
            var user = firebase.auth().currentUser;
            setOnlineStatus(user.uid, true);
            window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/rps.html");
        }, function (e) {
            console.log("Log in failed");
            console.log(e.message);
            addErrorModal(e.message);
        });
        console.log(auth.currentUser);
    } else {
        addErrorModal("Invalid email provided");
    }
});

$("#btn-sign-up").on("click", function () {
    $("#new-user-modal").css("display", "block");
});

$(".close").on("click", function () {
    $(this).parent().parent().css("display", "none");
    $("#txt-password-new-user").val("");
    $("#txt-password-new-user-confirm").val("");
})

$("#btn-new-user").on("click", function (event) {
    event.preventDefault();
    var email = $("#txt-email-new-user").val().trim();
    var username = $("#txt-username-new-user").val().trim();
    var password = $("#txt-password-new-user").val().trim();
    var passwordConfirm = $("#txt-password-new-user-confirm").val().trim();
    if (validateEmail(email) && validatePassword(password, passwordConfirm) && validateUserName(username)) {
        var promise = auth.createUserWithEmailAndPassword(email, password);
        promise.then(function () {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: username
            }).then(function () {
                console.log("write user data");
                var user = firebase.auth().currentUser;
                writeUserData(user.uid, user.displayName);
                setOnlineStatus(user.uid, true);
                window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/rps.html");
            });
        }, function (e) {
            console.log("Sign up failed");
            console.log(e.message);
            addErrorModal(e.message);
        })
    }
});


$("#btn-log-out").on("click", function () {
    setOnlineStatus(firebase.auth().currentUser.uid, false);
    auth.signOut();
});

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://maps.googleapis.com/maps/api/geocode/json?address=94105&key=AIzaSyBxgMHK10T-YS90r9OQhsSJm_aeEFAGcZ8",
  "method": "GET"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});


