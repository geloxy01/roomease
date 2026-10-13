<?php
require_once 'config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $db->query("SELECT id, fullname, username, role, teacher_id, department, created_at FROM users ORDER BY fullname ASC");
    $users  = $result->fetch_all(MYSQLI_ASSOC);
    respond($users);
}

$body = getBody();

if ($method === 'PUT') {
    $id          = intval($body['id'] ?? 0);
    $current     = $body['current_password'] ?? '';
    $new_pass    = $body['new_password'] ?? '';

    if (!$id || !$current || !$new_pass) {
        respond(['error' => 'Invalid request.'], 400);
    }

    $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row || !password_verify($current, $row['password'])) {
        respond(['error' => 'Current password is incorrect.'], 401);
    }

    $hashed = password_hash($new_pass, PASSWORD_BCRYPT);
    $stmt   = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashed, $id);
    $stmt->execute();
    respond(['message' => 'Password changed successfully.']);
}

if ($method === 'DELETE') {
    $id = intval($body['id'] ?? 0);
    if (!$id) respond(['error' => 'Invalid ID.'], 400);

    $check = $db->query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'admin'");
    $count = $check->fetch_assoc()['cnt'];

    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if ($user['role'] === 'admin' && $count <= 1) {
        respond(['error' => 'Cannot remove the only admin account.'], 403);
    }

    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    respond(['message' => 'User removed.']);
}

respond(['error' => 'Method not allowed.'], 405);
