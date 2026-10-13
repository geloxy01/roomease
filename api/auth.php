<?php
require_once 'config.php';

$body   = getBody();
$action = $body['action'] ?? '';
$db     = getDB();


if ($action === 'login') {
    $username = trim($body['username'] ?? '');
    $password = $body['password'] ?? '';

    if (!$username || !$password) {
        respond(['error' => 'Please fill in all fields.'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        respond(['error' => 'Username does not exist.'], 401);
    }

    if (!password_verify($password, $user['password'])) {
        respond(['error' => 'Incorrect password.'], 401);
    }

    unset($user['password']);
    respond(['user' => $user]);
}


if ($action === 'register_teacher') {
    $fullname   = trim($body['fullname'] ?? '');
    $username   = trim($body['username'] ?? '');
    $password   = $body['password'] ?? '';
    $teacher_id = trim($body['teacher_id'] ?? '');
    $department = trim($body['department'] ?? '');

    if (!$fullname || !$username || !$password || !$teacher_id || !$department) {
        respond(['error' => 'Please fill in all fields.'], 400);
    }

    $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond(['error' => 'Username already exists.'], 409);
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $stmt   = $db->prepare("INSERT INTO users (fullname, username, password, role, teacher_id, department) VALUES (?, ?, ?, 'teacher', ?, ?)");
    $stmt->bind_param("sssss", $fullname, $username, $hashed, $teacher_id, $department);

    if ($stmt->execute()) {
        respond(['message' => 'Registration successful.']);
    } else {
        respond(['error' => 'Registration failed.'], 500);
    }
}


if ($action === 'register_student') {
    $fullname   = trim($body['fullname'] ?? '');
    $username   = trim($body['username'] ?? '');
    $password   = $body['password'] ?? '';
    $student_id = trim($body['student_id'] ?? '');
    $department = trim($body['department'] ?? '');

    if (!$fullname || !$username || !$password || !$student_id || !$department) {
        respond(['error' => 'Please fill in all fields.'], 400);
    }

    $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond(['error' => 'Username already exists.'], 409);
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    // student_id stored in teacher_id column for reuse
    $stmt   = $db->prepare("INSERT INTO users (fullname, username, password, role, teacher_id, department) VALUES (?, ?, ?, 'student', ?, ?)");
    $stmt->bind_param("sssss", $fullname, $username, $hashed, $student_id, $department);

    if ($stmt->execute()) {
        respond(['message' => 'Registration successful.']);
    } else {
        respond(['error' => 'Registration failed.'], 500);
    }
}

respond(['error' => 'Invalid action.'], 400);
