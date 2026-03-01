let products = [];
let carts = [];

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

                $("#sel-products").empty();
                $("#sel-products").append(`<option value="">Select Item</option>`);

                for(let i = 0; i < products.length; i++){
                    const product = products[i];
                    
                    $("#sel-products").append(`
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

    $("#sel-products").change(function () {

        let productId = $(this).val();

        if (!productId) return;

        const product = products.find(a => a.id === productId);

        const modal = $('#mdl-add-item');
        modal.find("#lbl-item-title").text(product.name);
        modal.find("#inp-id").val(product.id);
        modal.find("#inp-stock-on-hand").val(product.stockOnHand);
        modal.find("#inp-selling-price").val(product.sellingPrice);
        modal.find("#inp-quantity").val(1);

        modal.modal("show");

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
        const id = $("#inp-id").val();
        const name = $("#lbl-item-title").text();
        const stockOnHand = $("#inp-stock-on-hand").val();
        const quantity = parseInt($('#inp-quantity').val()) || 0
        const sellingPrice = parseFloat($("#inp-selling-price").val());
        const totalAmount = quantity * sellingPrice;

        const existingIndex = carts.findIndex(item => item.id === id);
        
        if(stockOnHand <=0){
            toastr.error("Insuficient stock on hand!");
            return;
        }

        if(quantity <=0){
            toastr.error("Please enter a valid quantity!");
            return;
        }
    
        if (existingIndex === -1) {
            carts.push({
                id,
                name,
                quantity,
                sellingPrice,
                totalAmount: sellingPrice * quantity
            });
        } else {

            var totalQuantity = quantity + carts[existingIndex].quantity;
            if(totalQuantity > stockOnHand){
                toastr.error("Insuficient stock on hand!");
            return;
            }
            
            // Update quantity and totalAmount
            carts[existingIndex].quantity += quantity;
            carts[existingIndex].totalAmount = carts[existingIndex].sellingPrice * carts[existingIndex].quantity;
        }
    
        updateCartUI();

        toastr.success(`Added ${quantity} item(s) successfully!`);

        $("#mdl-add-item").modal("hide");
    });

    $("#inp-cash-received").keyup(function () {
        let amountDue = parseFloat($("#inp-amount-due").val());
        let cashReceived = parseFloat($(this).val());

        let changed = cashReceived - amountDue;
        $("#inp-changed").val(changed);
    });

    function updateCartUI() {
        $("#div-added-items").empty();
        let totalAmountDue = 0;
    
        carts.forEach((item, index) => {
            totalAmountDue += item.totalAmount;
    
            const itemHtml = `
                <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
                    <div>
                        <strong>Product Name: ${item.name}</strong><br>
                        Qty: ${item.quantity} x ₱${item.sellingPrice} = ₱${item.totalAmount}
                    </div>
                    <button class="btn btn-sm btn-danger btn-remove" data-index="${index}">Remove</button>
                </div>
            `;
    
            $("#div-added-items").append(itemHtml);
        });
    
        $("#inp-amount-due").val(totalAmountDue);
        $("#inp-cash-received").val(totalAmountDue);
        $("#inp-changed").val(0);
    }       
    
    // Remove product
    $(document).on("click", ".btn-remove", function() {
        const index = $(this).data("index");
        carts.splice(index, 1);
        updateCartUI();
    });

    $("#btn-cash").click(function () {

        const amountDue = parseFloat($('#inp-amount-due').val()) || 0;
        const cashReceived = $("#inp-cash-received").val();
        const changed = $("#inp-changed").val();

        if (carts.length === 0) {
            toastr.error("No added product!");
        }
        $.ajax({
            url: API_URL,
            method: "GET",
            data: {
                action: "cashPayment",
                amountDue: amountDue,
                cashReceived: cashReceived,
                changed: changed,
                carts: JSON.stringify(carts)
            },
            success: function (response) {
                loadProducts();
                carts=[];
                updateCartUI();
                toastr.error("No added product!");
            },
            error: function (err) {
                console.log("Error loading products", err);
                alert("Failed to load products");
            }
        });

    });

});
