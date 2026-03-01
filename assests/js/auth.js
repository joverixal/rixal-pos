$(document).ready(function () {

    $("#btn-login").click(function () {

        let username = $("#inp-username").val();
        let password = $("#inp-password").val();

        if (username === "admin" && password === "1234") {
            localStorage.setItem("isLoggedIn", true);
            window.location.href = "main.html";
        } else {
            alert("Invalid login");
        }

    });

});