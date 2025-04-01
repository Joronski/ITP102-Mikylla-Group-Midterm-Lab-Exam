<?php
    // Connect to the database
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'hospital_db';
    $port = 3307;

    $conn = new mysqli($host, $user, $pass, $db, $port);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if login data is posted
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'];
        $password = md5($_POST['password']);

        // Validate user
        $query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            // Success - Redirect to badges_lab.html
            header("Location: ../badges_lab.html");
        } else {
            // Invalid login
            echo "<script>alert('Invalid Credentials!'); window.location.href='../index.html';</script>";
        }
    }

    $conn->close();
?>