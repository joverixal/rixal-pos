let products = [];
let cart = [];

$(document).ready(function () {

    loadProducts();

    function loadProducts() {

        $.ajax({
            url: API_URL,
            method: "GET",
            data: {
                action: "getProducts"
            },
            success: function (response) {

                if (typeof response === "string") {
                    response = JSON.parse(response);
                }

                products = response;

                $("#sel-items").empty();
                $("#sel-items").append(`<option value="">Select Item</option>`);

                // Skip header row (index 0)
                for (let i = 1; i < products.length; i++) {

                    let product = products[i];

                    let productName = product[1];     // Product Name
                    let stockOnHand = product[6];     // Stock
                    let sellingPrice = product[4];    // Selling Price

                    if (stockOnHand > 0) {
                        $("#sel-items").append(`
                            <option value="${i}">
                                ${productName} - ₱${sellingPrice}
                            </option>
                        `);
                    }
                }
            },
            error: function (err) {
                console.log("Error loading products", err);
                alert("Failed to load products");
            }
        });

    }

    $("#sel-items").change(function () {

        let selectedIndex = $(this).val();

        if (!selectedIndex) return;

        let product = products[selectedIndex];

        $("#lbl-item-title").text(product[1]);
        $("#inp-stock-on-hand").val(product[6]);
        $("#inp-selling-price").val(product[4]);
        $("#inp-quantity").val(1);

        let modal = new bootstrap.Modal(document.getElementById("mdl-add-item"));
        modal.show();

    });

    $("#btn-add-item").click(function () {

        let quantity = parseInt($("#inp-quantity").val());
        let sellingPrice = parseFloat($("#inp-selling-price").val());
        let totalAmount = quantity * sellingPrice;

        cart.push({
            quantity,
            sellingPrice,
            totalAmount
        });

        calculateAmountDue();
        $("#mdl-add-item").modal("hide");
    });

    $("#inp-cash-received").keyup(function () {
        let amountDue = parseFloat($("#inp-amount-due").val());
        let cashReceived = parseFloat($(this).val());

        let changed = cashReceived - amountDue;
        $("#inp-changed").val(changed);
    });

    function calculateAmountDue() {

        let amountDue = 0;

        cart.forEach(item => {
            amountDue += item.totalAmount;
        });

        $("#inp-amount-due").val(amountDue);
    }

    $("#btn-cash").click(function () {

        let amountDue = $("#inp-amount-due").val();
        let cashReceived = $("#inp-cash-received").val();
        let changed = $("#inp-changed").val();

        $.ajax({
            url: API_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                action: "addPayment",
                payment: [
                    Date.now(),
                    amountDue,
                    cashReceived,
                    changed,
                    new Date()
                ]
            }),
            success: function () {
                alert("Payment Saved");
            }
        });

    });

});