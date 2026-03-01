$(document).ready(function () {

    $("#btn-login").click(function () {

        let username = $("#inp-username").val().trim();
        let password = $("#inp-password").val().trim();

        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        $.ajax({
            url: API_URL,
            method: "GET",
            data: {
                action: "   "
            },
            success: function (response) {

                if (typeof response === "string") {
                    response = JSON.parse(response);
                }

                let users = response;
                let isValidUser = false;
                let loggedInUser = null;

                // Skip header row
                for (let i = 1; i < users.length; i++) {

                    let user = users[i];

                    let sheetUsername = user[2];
                    let sheetPassword = user[3];

                    if (username === sheetUsername && password === sheetPassword) {
                        isValidUser = true;
                        loggedInUser = {
                            id: user[0],
                            name: user[1],
                            username: user[2]
                        };
                        break;
                    }
                }

                if (isValidUser) {

                    localStorage.setItem("isLoggedIn", true);
                    localStorage.setItem("user", JSON.stringify(loggedInUser));

                    window.location.href = "main.html";

                } else {
                    alert("Invalid username or password");
                }

            },
            error: function (err) {
                console.log("Login error:", err);
                alert("Failed to connect to server");
            }
        });

    });

});