// Initialize categories in localStorage if not set
if (!localStorage.getItem("categoryData")) {
    const initialData = {
        "Patient Records": [],
        "Doctor Profiles": [],
        "Appointments": [],
        "Emergency Cases": []
    };
    localStorage.setItem("categoryData", JSON.stringify(initialData));
}

// Function to save record to localStorage
function saveRecord() {
    const category = $("#categorySelect").val();
    const record = $("#recordInput").val().trim();

    if (record === "") {
        alert("Please enter record details.");
        return;
    }

    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    categoryData[category].push(record);
    localStorage.setItem("categoryData", JSON.stringify(categoryData));

    $("#recordInput").val(""); // Clear input field
    loadChart(); // Refresh chart

    // After saving the record and refreshing the chart, update badges
    if (typeof updateCategoryBadges === 'function') {
        updateCategoryBadges();
    }
}

// Function for stable category display with icons and modular structure
function loadChart() {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    const recordsChart = $("#recordsChart");
    recordsChart.empty();

    // Get the selected category from the URL to compare
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");

    // Iterate through each category and generate its card
    for (const category in categoryData) {
        const records = categoryData[category];
        const recordCount = records.length;
        const isSelected = category === selectedCategory;

        const recordsHTML = `
            <div class="col">
                <div class="card-2 shadow-sm ${isSelected ? 'border-primary' : ''}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${category}</h5>
                        <p class="card-text text-muted">Total Records: <strong>${recordCount}</strong></p>
                        <ul class="list-group list-group-flush">
                            ${generateRecordList(records, category, selectedCategory)}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        recordsChart.append(recordsHTML);
    }
}

function generateRecordList(records, category, selectedCategory) {
    let recordsHTML = "";
    const isDisabled = selectedCategory && category !== selectedCategory;
    
    if (records.length === 0) {
        recordsHTML = `
            <li class="list-group-item text-center text-muted">
                No records found for ${category}.
            </li>
        `;
    } else {
        records.forEach((record, index) => {
            recordsHTML += `
                <li class="list-group-item ${isDisabled ? 'text-muted' : ''}">
                    <div class="d-flex align-items-start">
                        <span class="fw-bold me-2">[${index + 1}]</span>
                        <span class="record-text">${record}</span>
                    </div>
                    <div class="btn-group mt-2" role="group">
                        <button class="btn btn-sm btn-outline-warning ${isDisabled ? 'disabled' : ''}" 
                                onclick="${isDisabled ? '' : `editRecord('${category}', ${index})`}" 
                                title="Edit" ${isDisabled ? 'disabled' : ''}>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ${isDisabled ? 'disabled' : ''}" 
                                onclick="${isDisabled ? '' : `deleteRecord('${category}', ${index})`}" 
                                title="Delete" ${isDisabled ? 'disabled' : ''}>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </li>
            `;
        });
    }

    return recordsHTML;
}


// Generate a single list item with Edit and Delete buttons
function generateRecordItem(record, category, index, selectedCategory) {
    const isDisabled = category !== selectedCategory ? "disabled" : "";
    return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <!-- Record Details -->
            <span id="record-${category}-${index}" class="text-start flex-grow-1">
                ${index + 1}. ${record}
            </span>

            <!-- Button Group with Icons -->
            <div class="btn-group d-flex gap-2 align-items-center">
                ${generateButton("edit", "warning", "fas fa-edit", category, index, isDisabled)}
                ${generateButton("delete", "danger", "fas fa-trash-alt", category, index, isDisabled)}
            </div>
        </li>
    `;
}

// Generate a button dynamically
function generateButton(action, btnClass, iconClass, category, index, isDisabled) {
    return `
        <button 
            class="btn btn-sm btn-${btnClass} w-auto" 
            onclick="${action}Record('${category}', ${index})"
            title="${capitalize(action)}"
            ${isDisabled}
        >
            <i class="${iconClass}"></i>
        </button>
    `;
}

// Capitalize the first letter of a word (for button titles)
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


$(document).ready(function () {
    loadChart();

    // Set category title dynamically
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");

    if (categoryName) {
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text("Displaying records for " + categoryName + ".");

        // Disable select and allow only the specified category dynamically
        const allowedCategory = categoryName; // Get category from URL
        $("#categorySelect option").each(function () {
            if ($(this).val() !== allowedCategory) {
                $(this).prop("disabled", true); // Disable other options
            } else {
                $(this).prop("selected", true); // Select the allowed category
            }
        });

        // Disable the entire select to prevent changes
        $("#categorySelect").prop("disabled", true);

        // Prevent invalid category access and redirect
        if (!["Patient Records", "Doctor Profiles", "Appointments", "Emergency Cases"].includes(allowedCategory)) {
            alert("Invalid category selected. Redirecting to dashboard.");
            window.location.href = "badges_lab.html";
        }
    }
});


// Function to edit a record
function editRecord(category, index) {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    const recordValue = categoryData[category][index];
    const newRecord = prompt("Edit record details:", recordValue);

    if (newRecord !== null && newRecord.trim() !== "") {
        categoryData[category][index] = newRecord.trim();
        localStorage.setItem("categoryData", JSON.stringify(categoryData));
        loadChart();
    } else if (newRecord === "") {
        alert("Record cannot be empty.");
    }

    // After the record is edited and chart refreshed, update badges
    if (typeof updateCategoryBadges === 'function') {
        updateCategoryBadges();
    }
}

// Function to delete a record
function deleteRecord(category, index) {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    categoryData[category].splice(index, 1); // Remove the record
    localStorage.setItem("categoryData", JSON.stringify(categoryData));
    loadChart(); // Refresh chart after deletion

    // After the record is deleted and chart refreshed, update badges
    if (typeof updateCategoryBadges === 'function') {
        updateCategoryBadges();
    }
}

// Save button click event
$("#saveRecordBtn").on("click", saveRecord);

// Initial load of chart data
$(document).ready(function () {
    loadChart();

    // Set category title dynamically
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");
    if (categoryName) {
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text("Displaying records for " + categoryName + ".");
    }
});

function showToast(title, message, type) {
    // Set toast content
    $("#toastTitle").text(title);
    $("#toastMessage").text(message);
    
    // Set toast header color based on type
    $("#toastHeader").removeClass("bg-warning bg-danger bg-success");
    if (type === "warning") {
        $("#toastHeader").addClass("bg-warning text-dark");
    } else if (type === "danger") {
        $("#toastHeader").addClass("bg-danger text-white");
    } else if (type === "success") {
        $("#toastHeader").addClass("bg-success text-white");
    }
    
    // Get the toast element
    const toastElement = document.getElementById('recordToast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 4000 // Auto-hide after 4 seconds
    });

    // Debugging
    console.log("Toast initialized:", toast);

    // Show the toast
    toast.show();
}

// Function to save record to localStorage
function saveRecord() {
    const category = $("#categorySelect").val();
    const record = $("#recordInput").val().trim();

    if (record === "") {
        alert("Please enter record details.");
        return;
    }

    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    categoryData[category].push(record);
    localStorage.setItem("categoryData", JSON.stringify(categoryData));

    $("#recordInput").val(""); // Clear input field
    loadChart(); // Refresh chart
    
    // Show toast notification for saved record
    showToast("Record Saved", `Successfully added new record to ${category}`, "success");
}

function editRecord(category, index) {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    if (!categoryData || !categoryData[category]) {
        console.error("Category data not found.");
        return;
    }

    const recordValue = categoryData[category][index];
    const newRecord = prompt("Edit record details:", recordValue);

    if (newRecord !== null && newRecord.trim() !== "") {
        categoryData[category][index] = newRecord.trim();
        localStorage.setItem("categoryData", JSON.stringify(categoryData));
        loadChart();

        console.log("Showing toast..."); // Debugging
        showToast("Record Updated", `Successfully updated record in ${category}`, "warning");
    } else if (newRecord === "") {
        alert("Record cannot be empty.");
    }
}

// Function to delete a record
function deleteRecord(category, index) {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    const recordValue = categoryData[category][index];
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete this record?`)) {
        categoryData[category].splice(index, 1); // Remove the record
        localStorage.setItem("categoryData", JSON.stringify(categoryData));
        loadChart(); // Refresh chart after deletion
        
        // Show toast notification for delete
        showToast("Record Deleted", `Successfully deleted record from ${category}`, "danger");
    }
}

// Logout functionality
$("#logoutBtn").on("click", function () {
    window.location.href = "index.html";
});