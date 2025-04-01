// Function to update badges for all categories
function updateCategoryBadges() {
    // Get data from localStorage
    const categoryData = JSON.parse(localStorage.getItem("categoryData")) || {
        "Patient Records": [],
        "Doctor Profiles": [],
        "Appointments": [],
        "Emergency Cases": []
    };
    
    // Update the badge counts in the UI
    for (const category in categoryData) {
        const recordCount = categoryData[category].length;
        
        // Find the badge element for this category and update it
        $(`#categoryList a`).each(function() {
            const linkText = $(this).text().trim().replace(/\d+$/, '').trim();
            if (linkText === category) {
                // Find the badge inside this link and update its text
                $(this).find('.badge').text(recordCount);
            }
        });
    }
}

// Function to get badge color based on category name
function getBadgeColorForCategory(category) {
    if (category.includes("Patient Records")) {
        return "#17a2b8"; // Info blue
    } else if (category.includes("Doctor Profiles")) {
        return "#007bff"; // Primary blue
    } else if (category.includes("Appointment")) {
        return "#ffc107"; // Warning yellow
    } else if (category.includes("Emergency Cases")) {
        return "#dc3545"; // Danger red
    }
    return "#6c757d"; // Default secondary gray
}

// Initialize badges when the document is ready
$(document).ready(function() {
    // Update badge counts initially
    updateCategoryBadges();
    
    // Set up observer to update badges when localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'categoryData') {
            updateCategoryBadges();
        }
    });
});