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
      if(!isValidDate(startDate)){
        toastr.error("Input valid start date!");
        return;
      }
      if(!isValidDate(endDate)){
        toastr.error("Input valid end date!");
        return;
      }

     loadPaymentItems(startDate, endDate);
  
    });

   function isValidDate(dateStr) {
    // Regex for MM/DD/YYYY
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;

    // Parse components
    const [monthStr, dayStr, yearStr] = dateStr.split("/");
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);

    // Create date object
    const dt = new Date(year, month - 1, day);

    // Validate each component
    if (dt.getFullYear() !== year) return false;
    if (dt.getMonth() !== month - 1) return false;
    if (dt.getDate() !== day) return false;

    return true;
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
            },
            error: function (err) {
                console.log("Error payment items", err);
                alert("Failed to load payment items");
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






