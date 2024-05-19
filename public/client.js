function recordSetToHtmlTable(recordSet) {
    if (!Array.isArray(recordSet) || recordSet.length === 0) {
        return "<p>No data available</p>";
    }

    // Create table element
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    // Create table header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    
    // Get the keys from the first record as column headers
    const headers = Object.keys(recordSet[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.border = "1px solid #000";
        th.style.padding = "8px";
        th.style.backgroundColor = "black";
        headerRow.appendChild(th);
    });

    // Create table body
    const tbody = table.createTBody();
    recordSet.forEach(record => {
        const row = tbody.insertRow();
        headers.forEach(header => {
            const cell = row.insertCell();
            cell.textContent = record[header];
            cell.style.border = "1px solid #000";
            cell.style.padding = "8px";
        });
    });

    // Convert table element to HTML string
    const div = document.createElement("div");
    div.appendChild(table);
    return div.innerHTML;
}


$(document).ready(function(){
// document.querySelector("#values").setAttribute("placeholder", `Values to ${$('input[name=query]').val()}`)
 // Define a variable to store the timeout ID
 let typingTimer;
// Define a constant for the delay (in milliseconds) after which the function is called
const doneTypingInterval = 500; // Adjust as needed

// Event handler for the input field
$('input[name=query]').on('input', function() {
    // Clear the previous timeout
    clearTimeout(typingTimer);
    
    // Set a new timeout to trigger after the specified delay
    typingTimer = setTimeout(function() {
        // Capture the value of the input field
        const queryValue = $('input[name=query]').val();
           switch (queryValue.toLowerCase()) {
            case "select":
             document.querySelector("#values").setAttribute("placeholder", `Columns to ${queryValue}`)
                break;
            case "insert":
             document.querySelector("#values").setAttribute("placeholder", `Values to ${queryValue}`)
                break;
                case "delete":
             document.querySelector("#values").setAttribute("placeholder", `Where Condition?`)
                break;
                case "update":
             document.querySelector("#values").setAttribute("placeholder", `column1 = value ... Where condition;`)
                break;
            default:
             document.querySelector("#values").setAttribute("placeholder", `${queryValue}?`)
                break;
           }
        
    }, doneTypingInterval);
});
$('#query-form').submit(function(event){
    event.preventDefault();
                
    // serialize form data
    const formData = $(this).serialize();
    console.log(formData)
    $.ajax({
        url: '/index.js',
        method: 'post',
        data: formData,
        success: function(response){
            console.log("Query executed successfully.");
            $('#results').html(recordSetToHtmlTable((response)));
            //console.log(response);

        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            $('#results').html("Error: " + error);
        }
    });
});
$('#join-form').submit(function (event) {
    event.preventDefault();
    // serialize form data
    const formData = $(this).serialize();
    $.ajax({
        url: '/index.js',
        method: 'post',
        data: formData,
        success: function(response){
            console.log("Join Query executed successfully.");
            $('#results').html(recordSetToHtmlTable((response)));
            //console.log(response);

        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            $('#results').html("Error: " + error);
        }
    });
});
});
