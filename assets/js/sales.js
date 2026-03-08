$(document).ready(function () {

    $("#nav-logout").click(function(e) {
        e.preventDefault();  // Prevent default link behavior
    
        // Clear login/session info
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
    
        // Optional: clear everything if you want
        // localStorage.clear();
    
        // Redirect to root without showing index.html
        window.location.href = "/rixal-pos/";
    });

    toastr.options = {
        "positionClass": "toast-bottom-center", // Bottom left corner
        "timeOut": "3000",             // Auto hide after 3s
        "extendedTimeOut": "1000",
        "preventDuplicates": true
    };

    function loadPaymentItems() {

        $.ajax({
            url: API_URL,
            method: "GET",
            data: {
                action: "getSales"
            },
            success: function (response) {

                if (typeof response === "string") {
                    response = JSON.parse(response);
                }

                const paymentItems = response.paymentItems;
                buildPaymentItemsHTML(paymentItems);
            },
            error: function (err) {
                console.log("Error payment items", err);
                alert("Failed to load payment items");
            }
        });

    }

    $("#btn-filter").click(function() {
      conts startDate = $('#inp-end-date').val();
      conts endDate = $('#inp-end-date').val();
      if(moment(startDate, "MM/DD/YYYY", true).isValid()){
        toastr.error("Input valid start date!");
        return;
      }
      if(moment(endDate, "MM/DD/YYYY", true).isValid()){
        toastr.error("Input valid end date!");
        return;
      }
  
    });

    function buildPaymentItemsHTML(paymentItems) {
        $("#div-payment-items").empty();
        let totalQuantity = 0;
    
        paymentItems.forEach((paymentItem, index) => {
            totalQuantity += paymentItem.quantity;
    
            const paymentItemHtml = `
                <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
                    <div>
                        <strong>${item.productName}</strong><br>
                        Qty: ${item.quantity} x ₱${item.sellingPrice} = ₱${item.totalAmount}
                    </div>
                    <button class="btn btn-sm btn-danger btn-remove" data-index="${index}">
                      <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
    
            $("#div-payment-items").append(paymentItemHtml);
        });
    
        $("#inp-total-quantity").val(totalQuantity);
    }       
});
