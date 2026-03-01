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

                products = response.products;

                $("#sel-items").empty();
                $("#sel-items").append(`<option value="">Select Item</option>`);

                for(let i = 0; i < products.length; i++){
                    const product = products[i];
                    
                    $("#sel-items").append(`
                        <option value="${product.id}">
                            ${product.name} - ₱${product.sellingPrice}
                        </option>
                    `);
                }
            },
            error: function (err) {
                console.log("Error loading products", err);
                alert("Failed to load products");
            }
        });

    }

    $("#sel-items").change(function () {

        let productId = $(this).val();

        if (!productId) return;

        const product = products.find(a => a.id === productId);
        $("#lbl-item-title").text(product.name);
        $("#inp-stock-on-hand").val(product.stockOnHand);
        $("#inp-selling-price").val(product.sellingPrice);
        $("#inp-quantity").val(1);

        const modal = $('#mdl-add-item').modal("show");

    });

    $("#btn-increase").click(function() {
        let qty = parseInt($("#inp-quantity").val()) || 1;
        $("#inp-quantity").val(qty + 1);
    });
    
    $("#btn-decrease").click(function() {
        let qty = parseInt($("#inp-quantity").val()) || 1;
        if (qty > 1) $("#inp-quantity").val(qty - 1);
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
