$(document).ready(function () {
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

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validatePassword(password){
        console.log(password.length);
        if(password.length >= 6 && password.length <= 20){
            return true;
        } else {
            console.log("passwords must be between 6 and 20 characters in length");
            return false;
        }
    }

    $("#btnLogin").on("click", function () {
        event.preventDefault();
        var email = $("#txtEmail").val().trim();
        var password = $("#txtPassword").val().trim();
        if (validateEmail(email)) {
            var promise = auth.signInWithEmailAndPassword(email, password);
            promise.catch(function (e) {
                console.log("Log in failed");
                console.log(e.message);
            })
        } else {
            console.log("Invalid email");
        }
    });

    $("#btnSignUp").on("click", function () {
        event.preventDefault();
        var email = $("#txtEmail").val().trim();
        var password = $("#txtPassword").val().trim();
        if (validateEmail(email) && validatePassword(password)) {
            var promise = auth.createUserWithEmailAndPassword(email, password);
            promise.catch(function (e) {
                console.log("Sign up failed");
                console.log(e.message);
            });
        } else {
            console.log("Invalid email or password");
        }
    });

    $("#btnLogOut").on("click", function () {
        auth.signOut();
    })

    auth.onAuthStateChanged(function (user) {
        if (user) {
            console.log(user);
            if (window.location.pathname === "/Users/andrewlazenby/Desktop/code/RPS-Multiplayer/index.html" || window.location.pathname === "RPS-Multiplayer/index.html") {
                window.location.replace("/Users/andrewlazenby/Desktop/code/RPS-Multiplayer/rps.html");
            }
        } else {
            console.log("Not logged in");
            if (window.location.pathname === "/Users/andrewlazenby/Desktop/code/RPS-Multiplayer/rps.html" || window.location.pathname === "RPS-Multiplayer/rps.html") {
                window.location.replace("/Users/andrewlazenby/Desktop/code/RPS-Multiplayer/index.html");
            }
        }
    });

});

