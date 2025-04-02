/**
 * script.js - Main application logic for medical records system
 * Handles record management (create, read, update, delete operations),
 * UI interactions, and notifications
 */

/**
 * Initialize categories in localStorage if not already set
 */
function initializeLocalStorage() {
    if (!localStorage.getItem("categoryData")) {
        const initialData = {
            "Patient Records": [],
            "Doctor Profiles": [],
            "Appointments": [],
            "Emergency Cases": []
        };
        localStorage.setItem("categoryData", JSON.stringify(initialData));
    }
}

/**
 * Saves a new record to the selected category
 * Validates input, updates localStorage, and refreshes UI
 */
function saveRecord() {
    const category = $("#categorySelect").val();
    const record = $("#recordInput").val().trim();

    // Validation
    if (record === "") {
        alert("Please enter record details.");
        return;
    }

    // Update localStorage
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    categoryData[category].push(record);
    localStorage.setItem("categoryData", JSON.stringify(categoryData));

    // Update UI
    $("#recordInput").val(""); // Clear input field
    loadChart(); // Refresh chart
    
    // Show success notification
    showToast("Record Saved", `Successfully added new record to ${category}`, "success");
    
    // Update badges if function exists
    if (typeof updateCategoryBadges === 'function') {
        updateCategoryBadges();
    }
}

/**
 * Loads and displays all records in a chart view
 * Shows records grouped by category with actions
 */
function loadChart() {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    const recordsChart = $("#recordsChart");
    recordsChart.empty();

    // Get the selected category from the URL for comparison
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");

    // Generate UI for each category
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

/**
 * Generates HTML list of records for a specific category
 * @param {Array} records - Array of record strings
 * @param {String} category - Category name
 * @param {String} selectedCategory - Currently selected category
 * @returns {String} HTML string for records list
 */
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

/**
 * Generates HTML for a single record item
 * @param {String} record - Record content
 * @param {String} category - Category name
 * @param {Number} index - Record index
 * @param {String} selectedCategory - Currently selected category
 * @returns {String} HTML string for a record item
 */
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

/**
 * Generates HTML for an action button
 * @param {String} action - Button action (edit/delete)
 * @param {String} btnClass - Button style class
 * @param {String} iconClass - Icon class
 * @param {String} category - Category name
 * @param {Number} index - Record index
 * @param {String} isDisabled - Disabled attribute if needed
 * @returns {String} HTML string for button
 */
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

/**
 * Capitalizes the first letter of a word
 * @param {String} word - Word to capitalize
 * @returns {String} Capitalized word
 */
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Handles editing a record
 * @param {String} category - Category name
 * @param {Number} index - Record index
 */
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

        showToast("Record Updated", `Successfully updated record in ${category}`, "warning");
        
        // Update badges if function exists
        if (typeof updateCategoryBadges === 'function') {
            updateCategoryBadges();
        }
    } else if (newRecord === "") {
        alert("Record cannot be empty.");
    }
}

/**
 * Handles deleting a record
 * @param {String} category - Category name
 * @param {Number} index - Record index
 */
function deleteRecord(category, index) {
    const categoryData = JSON.parse(localStorage.getItem("categoryData"));
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete this record?`)) {
        categoryData[category].splice(index, 1); // Remove the record
        localStorage.setItem("categoryData", JSON.stringify(categoryData));
        loadChart(); // Refresh chart after deletion
        
        // Show toast notification for delete
        showToast("Record Deleted", `Successfully deleted record from ${category}`, "danger");
        
        // Update badges if function exists
        if (typeof updateCategoryBadges === 'function') {
            updateCategoryBadges();
        }
    }
}

/**
 * Shows a toast notification
 * @param {String} title - Toast title
 * @param {String} message - Toast message
 * @param {String} type - Toast type (success/warning/danger)
 */
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
    
    // Get the toast element and initialize Bootstrap toast
    const toastElement = document.getElementById('recordToast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 4000 // Auto-hide after 4 seconds
    });

    // Show the toast
    toast.show();
}

/**
 * Sets up the category page based on URL parameters
 */
function setupCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");

    if (categoryName) {
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text("Displaying records for " + categoryName + ".");

        // Configure category dropdown to only allow the specified category
        const allowedCategory = categoryName;
        $("#categorySelect option").each(function () {
            if ($(this).val() !== allowedCategory) {
                $(this).prop("disabled", true); // Disable other options
            } else {
                $(this).prop("selected", true); // Select the allowed category
            }
        });

        // Disable the entire select to prevent changes
        $("#categorySelect").prop("disabled", true);

        // Security check: Redirect to dashboard for invalid category
        if (!["Patient Records", "Doctor Profiles", "Appointments", "Emergency Cases"].includes(allowedCategory)) {
            alert("Invalid category selected. Redirecting to dashboard.");
            window.location.href = "badges_lab.html";
        }
    }
}

// Initialize functionality when document is ready
$(document).ready(function () {
    initializeLocalStorage();
    loadChart();
    setupCategoryPage();
    
    // Set up event handlers
    $("#saveRecordBtn").on("click", saveRecord);
    $("#logoutBtn").on("click", function () {
        window.location.href = "index.html";
    });
});
