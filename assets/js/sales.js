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

    $("#btn-filter").click(function() {
      const startDate = $('#inp-start-date').val();
      const endDate = $('#inp-end-date').val();
      if(startDate == ''){
        toastr.error("Input valid start date!");
        return;
      }
      if(endDate == ''){
        toastr.error("Input valid end date!");
        return;
      }    
     loadPaymentItems(getFormattedDate(startDate), getFormattedDate(endDate));
  
    });

    // Check if there's a value
    function getFormattedDate(dateVal) {
        // Split the string into parts [yyyy, MM, dd]
        var parts = dateVal.split('-');
        // Rearrange to MM/dd/yyyy
        var formattedDate = parts[1] + '/' + parts[2] + '/' + parts[0];
        return formattedDate;
    }

    function loadPaymentItems(startDate, endDate) {

        $("#div-payment-items").empty();
        
        var btnFilter = $('#btn-filter');
        var originalHtml = btnFilter.html();

        // Disable and show spinner
        btnFilter.prop('disabled', true);
        btnFilter.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        
        $.ajax({
            url: API_URL,
            method: "GET",
            data: {
                action: "getSales",
                startDate: startDate,
                endDate: endDate,
            },
            success: function (response) {

                if (typeof response === "string") {
                    response = JSON.parse(response);
                }

                const paymentItems = response.paymentItems;
                buildPaymentItemsHTML(paymentItems);

                // Restore button
                btnFilter.prop('disabled', false);
                btnFilter.html(originalHtml);
            },
            error: function (err) {
                console.log("Error payment items", err);
                alert("Failed to load payment items");
                // Restore button
                btnFilter.prop('disabled', false);
                btnFilter.html(originalHtml);
            }
        });
    }

    function buildPaymentItemsHTML(paymentItems) {        
        let totalUnitPrice = 0;
        let totalSellingPrice = 0;
        let totalProfit = 0;
        let totalQuantity = 0;
        let totalAmount = 0;
    
        paymentItems.forEach((paymentItem, index) => {
            totalUnitPrice += paymentItem.quantity * paymentItem.unitPrice
            totalSellingPrice += paymentItem.quantity * paymentItem.sellingPrice
            totalProfit += paymentItem.quantity * paymentItem.profit
            totalQuantity += paymentItem.quantity;
            totalAmount += paymentItem.totalAmount;
            
            const paymentItemHtml = `
                <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
                    <div>
                        <strong>${paymentItem.productName}</strong><br>
                        Qty: ${paymentItem.quantity} x ₱${paymentItem.sellingPrice} = ₱${paymentItem.totalAmount}
                    </div>
                    <button class="btn btn-sm btn-danger btn-remove" data-index="${index}">
                      <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
    
            $("#div-payment-items").append(paymentItemHtml);
        });
    
        $("#inp-total-unit-price").val(totalUnitPrice.toFixed(2));
        $("#inp-total-selling-price").val(totalSellingPrice.toFixed(2));
        $("#inp-total-profit").val(totalProfit.toFixed(2));
        $("#inp-total-quantity").val(totalQuantity.toFixed(2));
        $("#inp-total-amount").val(totalAmount.toFixed(2));
    }       
});
















