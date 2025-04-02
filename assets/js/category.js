/**
 * category.js - Handles category-specific functionality for medical records system
 * Manages dynamic category descriptions, input hints, and localStorage operations
 */

// Define category descriptions and input hints dynamically
const categoryDescriptions = {
    "Patient Records": {
        description: "This section contains all patient information, medical history, and reports.",
        inputHint: "Enter patient name, medical history, or relevant reports. <br>`Name: [Your Name], Medical History: [Your Medical History], Reports: [Your Reports]`"
    },
    "Doctor Profiles": {
        description: "Doctor profiles include their specialization, contact details, and availability.",
        inputHint: "Enter doctor's name, specialization, and contact information. <br>`Name: [Your Doctor's Name], Specialization: [The Doctor's Medical Specialization], Contact Information: [Contact Number]`"
    },
    "Appointments": {
        description: "This section manages patient appointments with available doctors.",
        inputHint: "Enter appointment details, such as date, time, and patient name. <br>`Appointment Date: [YYYY/MM/DD], Appointment Time: [00:00], Patient Name: [Their Name]`"
    },
    "Emergency Cases": {
        description: "Handles critical emergency cases and triage information for urgent care.",
        inputHint: "Enter emergency details or case description for quick triage. <br>`Emergency Details: [Details] or Case Description: [Description]`" // Fixed typo: "Emergrncy" -> "Emergency"
    }
};

/**
 * Initialize categories in localStorage if not already set
 * Creates empty arrays for each category
 */
function initializeCategories() {
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
 * Retrieves category data from localStorage
 * @returns {Object} Category data object
 */
function getCategoryData() {
    return JSON.parse(localStorage.getItem("categoryData")) || {};
}

/**
 * Saves category data to localStorage
 * @param {Object} data - Category data to save
 */
function saveCategoryData(data) {
    localStorage.setItem("categoryData", JSON.stringify(data));
}

/**
 * Sets up the category page based on URL parameters
 * Configures UI elements according to the selected category
 */
function loadCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");
    
    if (categoryName) {
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text("Displaying records for " + categoryName + ".");
        
        // Configure category selection dropdown to only allow the specified category
        $("#categorySelect option").each(function () {
            if ($(this).val() !== categoryName) {
                $(this).prop("disabled", true); // Disable other options
            } else {
                $(this).prop("selected", true); // Select the allowed category
            }
        });
        
        // Disable the entire select dropdown to prevent changes
        $("#categorySelect").prop("disabled", true);
        
        // Security check: Redirect to dashboard if invalid category
        const validCategories = ["Patient Records", "Doctor Profiles", "Appointments", "Emergency Cases"];
        if (!validCategories.includes(categoryName)) {
            alert("Invalid category selected. Redirecting to dashboard.");
            window.location.href = "badges_lab.html";
        }
    }
}

// Set up category page content when document loads
$(window).on('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category')?.trim();

    if (categoryName && categoryDescriptions.hasOwnProperty(categoryName)) {
        // Set the category title and description dynamically
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text(categoryDescriptions[categoryName].description);

        // Add input hint below the description
        $("#categoryDescription").after(`
            <p class="text-info text-center" id="inputHint">
                <em>${categoryDescriptions[categoryName].inputHint}</em>
            </p>
        `);
    } else {
        // Handle invalid or missing categories gracefully
        $("#categoryTitle").text("Category Not Found");
        $("#categoryDescription").text("Please select a valid category from the dashboard.");

        // Disable input and buttons for invalid categories
        $("#recordInput").prop("disabled", true);
        $("#saveRecordBtn").prop("disabled", true);
    }
});

// Initialize on document ready
$(document).ready(function() {
    initializeCategories();
    loadCategoryPage();
});
