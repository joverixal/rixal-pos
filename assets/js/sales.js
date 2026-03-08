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

    function getFormattedDateISO(isoDate){
        // Convert to a Date object
        var dateObj = new Date(isoDate);
        
        // Helper function to pad numbers
        function pad(n) { return n < 10 ? '0' + n : n; }
        
        // Extract parts
        var month = pad(dateObj.getMonth() + 1); // Months are 0-based
        var day = pad(dateObj.getDate());
        var year = dateObj.getFullYear();
        
        var hours = dateObj.getHours();
        var minutes = pad(dateObj.getMinutes());
        
        // Convert 24h -> 12h format
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 -> 12
        hours = pad(hours);
        
        // Build formatted string
        var formatted = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ampm;
        
        return formatted; // "03/03/2026 09:40AM"
    }

    function getFormattedNumber(number){
        // keep as string, add commas
        let formatted = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formatted; // "1,234,567.89"
    }

    function loadPaymentItems(startDate, endDate) {

        $("#inp-total-unit-price").val('₱0.00');
        $("#inp-total-selling-price").val('₱0.00');
        $("#inp-total-profit").val('₱0.00');
        $("#inp-total-quantity").val('0.00');
        $("#inp-total-amount").val('₱0.00');
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
            const createdAt = getFormattedDateISO(paymentItem.createdAt);
            
            const paymentItemHtml = `
                <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
                    <div>
                        <span class="badge bg-info text-dark">${createdAt}</span> 
                        <strong>${paymentItem.productName}</strong><br>
                        Qty: ${getFormattedNumber(paymentItem.quantity)} x ₱${getFormattedNumber(paymentItem.sellingPrice)} = ₱${getFormattedNumber(paymentItem.totalAmount)}
                    </div>
                </div>
                `;
    
            $("#div-payment-items").append(paymentItemHtml);
        });
    
        $("#inp-total-unit-price").val(`₱${getFormattedNumber(totalUnitPrice)}`);
        $("#inp-total-selling-price").val(`₱${getFormattedNumber(totalSellingPrice)}`);
        $("#inp-total-profit").val(`₱${getFormattedNumber(totalProfit)}`);
        $("#inp-total-quantity").val(getFormattedNumber(totalQuantity));
        $("#inp-total-amount").val(`₱${getFormattedNumber(totalAmount)}`);
    }       
});

































