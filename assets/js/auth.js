
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
            console.log("passwords do not match");
            return false;
        }
    } else {
        console.log("passwords must be between 6 and 20 characters in length");
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
        inviteSent: false,
        wins: 0,
        losses: 0,
    }).then(function () {
        console.log("Adding user succeeded");
    }).catch(function (error) {
        console.log("Unable to add user: " + error.message);
    });
}

function removeUserData(userId) {
    firebase.database().ref('users/' + userId).remove()
        .then(function () {
            console.log("Removing user succeeded");
        }).catch(function (error) {
            console.log("Unable to remove user: " + error.message);
        });
}

function setOnlineStatus(userId, onlineStatus) {
    firebase.database().ref('users/' + userId).update({
        online: onlineStatus
    }).then(function () {
        console.log("setting user to online status to " + onlineStatus + " succeeded");
    }).catch(function (error) {
        console.log("Unable to change users online status: " + error.message);
    });
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
        }, function (e) {
            console.log("Log in failed");
            console.log(e.message);
        });
        console.log(auth.currentUser);
    } else {
        console.log("Invalid email");
    }
});

$("#btn-sign-up").on("click", function () {
    $("#new-user-modal").css("display", "block");
});

$(".close").on("click", function () {
    $("#new-user-modal").css("display", "none");
    $("#txt-email-new-user").val("");
    $("#txt-username-new-user").val("");
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
        var newUserPromise = promise.then(function () {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: username
            });
        }, function (e) {
            console.log("Sign up failed");
            console.log(e.message);
        });
        newUserPromise.then(function () {
            writeUserData(user.uid, user.displayName);
            setOnlineStatus(user.uid, true);
        });
    } else {
        console.log("Invalid email or password");
    }
});


$("#btn-log-out").on("click", function () {
    setOnlineStatus(firebase.auth().currentUser.uid, false);
    auth.signOut();
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        console.log(user.email);
        console.log(user.displayName);
        if (window.location.pathname === "/RPS-Multiplayer/" || window.location.pathname === "/RPS-Multiplayer/index.html") {
            window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/rps.html");
        }
    } else {
        console.log("Not logged in");
        if (window.location.pathname === "/RPS-Multiplayer/rps.html") {
            window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/index.html");
        }
    }
});


