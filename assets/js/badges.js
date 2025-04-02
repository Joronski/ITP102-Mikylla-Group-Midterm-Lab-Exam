/**
 * badges.js - Badge management for medical records categories
 * Handles the display and updating of numerical badges on category links
 */

/**
 * Updates numerical badges for all categories based on record counts
 * Fetches counts from localStorage and updates UI elements
 */
function updateCategoryBadges() {
    // Get data from localStorage
    const categoryData = JSON.parse(localStorage.getItem("categoryData")) || {
        "Patient Records": [],
        "Doctor Profiles": [],
        "Appointments": [],
        "Emergency Cases": []
    };
    
    // Update the badge counts in the UI for each category
    for (const category in categoryData) {
        const recordCount = categoryData[category].length;
        
        // Find and update the badge element for this category
        $(`#categoryList a`).each(function() {
            const linkText = $(this).text().trim().replace(/\d+$/, '').trim();
            if (linkText === category) {
                // Update badge text with current record count
                $(this).find('.badge').text(recordCount);
            }
        });
    }
}

/**
 * Determines the appropriate badge color based on category name
 * @param {String} category - Category name
 * @returns {String} CSS color value for the badge
 */
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
    // This ensures badges stay in sync if data is modified in another tab/window
    window.addEventListener('storage', function(e) {
        if (e.key === 'categoryData') {
            updateCategoryBadges();
        }
    });
});
