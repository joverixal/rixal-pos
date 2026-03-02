$(document).ready(function () {

    var $loader = $("#login-loading");

    var isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

        setTimeout(function () {
            window.location.href = "pos.html";
        }, 800);

    } else {

        $loader.fadeOut(300);
    }

    toastr.options = {
        "positionClass": "toast-bottom-center", // Bottom left corner
        "timeOut": "3000",             // Auto hide after 3s
        "extendedTimeOut": "1000",
        "preventDuplicates": true
    };

    $("#btn-login").click(function () {

        let username = $("#inp-username").val().trim();
        let password = $("#inp-password").val().trim();

        if (!username || !password) {
            toastr.error("Please enter username and password");
            return;
        }

        const btnLogin = $('#btn-login');
        btnLogin.prop('disabled', true).text('Logging in...');

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

                    btnLogin.prop('disabled', false).text('Login');

                    localStorage.setItem("isLoggedIn", true);
                    localStorage.setItem("user", JSON.stringify(response.user));

                    window.location.href = "pos.html"; // redirect to main menu

                } else {
                    toastr.error(response.message || "Invalid username or password");
                    btnLogin.prop('disabled', false).text('Login');
                }

            },
            error: function (err) {
                btnLogin.prop('disabled', false).text('Login');
                
                console.log("Login error:", err);
                alert("Failed to connect to server");
            }
        });

    });

});
