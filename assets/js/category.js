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
        inputHint: "Enter emergency details or case description for quick triage. <br>`Emergrncy Details: [Details] or Case Description: [Description]`"
    }
};

// Run script after the document loads
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

        // Hide input and disable actions if invalid category
        $("#recordInput").prop("disabled", true);
        $("#saveRecordBtn").prop("disabled", true);
    }
});

// Initialize categories in localStorage if not set
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

// Function to get category data from localStorage
function getCategoryData() {
    return JSON.parse(localStorage.getItem("categoryData")) || {};
}

// Function to save category data to localStorage
function saveCategoryData(data) {
    localStorage.setItem("categoryData", JSON.stringify(data));
}

// Load category data for the current page if applicable
function loadCategoryPage() {
    // Set category title dynamically
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");
    
    if (categoryName) {
        $("#categoryTitle").text(categoryName);
        $("#categoryDescription").text("Displaying records for " + categoryName + ".");
        
        // Disable select and allow only the specified category dynamically
        $("#categorySelect option").each(function () {
            if ($(this).val() !== categoryName) {
                $(this).prop("disabled", true); // Disable other options
            } else {
                $(this).prop("selected", true); // Select the allowed category
            }
        });
        
        // Disable the entire select to prevent changes
        $("#categorySelect").prop("disabled", true);
        
        // Prevent invalid category access and redirect
        const validCategories = ["Patient Records", "Doctor Profiles", "Appointments", "Emergency Cases"];
        if (!validCategories.includes(categoryName)) {
            alert("Invalid category selected. Redirecting to dashboard.");
            window.location.href = "badges_lab.html";
        }
    }
}

// Initialize on document ready
$(document).ready(function() {
    initializeCategories();
    loadCategoryPage();
});