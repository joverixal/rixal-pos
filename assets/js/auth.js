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
            data: { action: "login", username: username, password: password },
            success: function (response) {

                // Parse if string
                if (typeof response === "string") {
                    response = JSON.parse(response);
                }

                // Backend already validates user
                if (response.success) {

                    localStorage.setItem("isLoggedIn", true);
                    localStorage.setItem("user", JSON.stringify(response.user));

                    window.location.href = "main.html"; // redirect to main menu

                } else {
                    alert(response.message || "Invalid username or password");
                }

            },
            error: function (err) {
                console.log("Login error:", err);
                alert("Failed to connect to server");
            }
        });

    });

});
