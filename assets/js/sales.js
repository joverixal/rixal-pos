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

    $("#btn-filter").prop('disabled', true);
    $("#btn-filter").html('<i class="fa fa-spinner fa-spin"></i>');
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

                $("#btn-filter").prop('disabled', false);
            },
            error: function (err) {
                console.log("Error payment items", err);
                alert("Failed to load payment items");
                $("#btn-filter").prop('disabled', false);
            }
        });
    }

    function buildPaymentItemsHTML(paymentItems) {
        $("#div-payment-items").empty();
        let totalQuantity = 0;
    
        paymentItems.forEach((paymentItem, index) => {
            totalQuantity += paymentItem.quantity;
    
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
    
        $("#inp-total-quantity").val(totalQuantity);
    }       
});











