<?php
    /**
     * Authentication Handler Script
     * 
     * This script handles user authentication by validating credentials
     * against the database and redirecting users accordingly.
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
        // Log error and display generic message
        error_log($e->getMessage());
        die("Database connection error. Please try again later.");
    }

    /**
     * Process login request
     */
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Validate and sanitize inputs
        $username = isset($_POST['username']) ? $conn->real_escape_string(trim($_POST['username'])) : '';
        
        // SECURITY IMPROVEMENT: Use password_hash() and password_verify() instead of md5
        // For now, maintaining md5 for compatibility but noting it should be replaced
        $password = isset($_POST['password']) ? md5($_POST['password']) : '';
        
        if (empty($username) || empty($password)) {
            redirectWithError("Username and password are required");
        }

        // Prepare and execute parameterized query to prevent SQL injection
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        if (!$stmt) {
            error_log("Query preparation failed: " . $conn->error);
            redirectWithError("An error occurred. Please try again.");
        }
        
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Success - User authenticated
            $stmt->close();
            $conn->close();
            header("Location: ../badges_lab.html");
            exit;
        } else {
            // Invalid credentials
            redirectWithError("Invalid credentials");
        }
        
        $stmt->close();
    }

    $conn->close();

    /**
     * Redirect to login page with error message
     * 
     * @param string $message Error message to display
     */
    function redirectWithError($message) {
        echo "<script>alert('" . htmlspecialchars($message, ENT_QUOTES) . "'); window.location.href='../index.html';</script>";
        exit;
    }
?>
