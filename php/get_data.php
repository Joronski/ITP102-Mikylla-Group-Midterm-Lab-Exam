<?php
    // Database connection settings
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'hospital_db'; 
    $port = 3307;

    // Create connection
    $conn = new mysqli($host, $user, $pass, $db, $port);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn -> connect_error);
    }

    // Fetch categories and product counts
    $query = "SELECT category_name, product_count FROM categories";
    $result = $conn->query($query);

    // Initialize data array
    $data = [];

    // Fetch results as associative array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Return JSON-encoded data
    echo json_encode($data);

    // Close the database connection
    $conn->close();
?>