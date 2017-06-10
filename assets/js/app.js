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

$(document).ready(function () {
    var ref = firebase.database().ref();
    var users = ref.child("users");
    users.once("value").then(function (snapshot) {
        snapshot.forEach(function (user) {
            if (user.child("online").val() === true) {
                addUserToOnlineList(user);
            }
        });
    });
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        console.log(user.email);
        console.log(user.displayName);
        if (user.displayName) {
            if (window.location.pathname === "/RPS-Multiplayer/" || window.location.pathname === "/RPS-Multiplayer/index.html") {
                window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/rps.html");
            }
        }
    } else {
        console.log("Not logged in");
        if (window.location.pathname === "/RPS-Multiplayer/rps.html") {
            window.location.replace("https://ikkanlaz.github.io/RPS-Multiplayer/index.html");
        }
    }
});

$(".user-row").on("click", function () {
    //set a new field in db like inviteSent: true
    //validate that inGame and inviteSent are both false for this current user and selected user
    //set inviteSent to true for both
    //maybe set a timeout?
    //
})