<?php
$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);

$conn = new mysqli('localhost', 'root', '', 'roomease');

// Delete existing admin
$conn->query("DELETE FROM users WHERE username = 'admin'");

// Insert with freshly generated hash
$stmt = $conn->prepare("INSERT INTO users (fullname, username, password, role, teacher_id, department) VALUES (?, 'admin', ?, 'admin', 'ADM-001', 'Administration')");
$fullname = 'Administrator';
$stmt->bind_param("ss", $fullname, $hash);
$stmt->execute();

echo "Done! Hash used: " . $hash;
echo "<br>Now login with admin / admin123";
$conn->close();
?>