<?php
    /**
     * Data Retrieval Script
     * 
     * This script retrieves category information from the database
     * and returns it as JSON data for client-side processing.
     */

    // Database configuration
    $config = [
        'host' => 'localhost',
        'username' => 'root',
        'password' => '',
        'database' => 'hospital_db',
        'port' => 3307
    ];

    /**
     * Establish database connection
     */
    try {
        $conn = new mysqli(
            $config['host'],
            $config['username'], 
            $config['password'],
            $config['database'],
            $config['port']
        );

        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
    } catch (Exception $e) {
        // Log error and return proper JSON error response
        error_log($e->getMessage());
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    /**
     * Fetch category data
     */
    try {
        // Prepare query
        $query = "SELECT category_name, product_count FROM categories";
        $result = $conn->query($query);
        
        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }
        
        // Initialize data array
        $data = [];
        
        // Fetch results as associative array
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        // Set content type header and return JSON-encoded data
        header('Content-Type: application/json');
        echo json_encode($data);
        
    } catch (Exception $e) {
        // Log error and return proper JSON error response
        error_log($e->getMessage());
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to retrieve data']);
    }

    // Close the database connection
    $conn->close();
?>
