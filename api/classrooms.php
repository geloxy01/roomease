<?php
require_once 'config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $result = $db->query("SELECT * FROM classrooms ORDER BY room_name ASC");
    $rooms  = $result->fetch_all(MYSQLI_ASSOC);
    respond($rooms);
}

$body = getBody();


if ($method === 'POST') {
    $room_name = trim($body['room_name'] ?? '');
    if (!$room_name) respond(['error' => 'Room name is required.'], 400);

    $stmt = $db->prepare("SELECT id FROM classrooms WHERE room_name = ?");
    $stmt->bind_param("s", $room_name);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond(['error' => 'A classroom with that name already exists.'], 409);
    }

    $stmt = $db->prepare("INSERT INTO classrooms (room_name) VALUES (?)");
    $stmt->bind_param("s", $room_name);
    $stmt->execute();
    respond(['id' => $db->insert_id, 'room_name' => $room_name]);
}


if ($method === 'PUT') {
    $id        = intval($body['id'] ?? 0);
    $room_name = trim($body['room_name'] ?? '');
    if (!$id || !$room_name) respond(['error' => 'Invalid data.'], 400);

    $stmt = $db->prepare("UPDATE classrooms SET room_name = ? WHERE id = ?");
    $stmt->bind_param("si", $room_name, $id);
    $stmt->execute();
    respond(['message' => 'Classroom updated.']);
}


if ($method === 'DELETE') {
    $id = intval($body['id'] ?? 0);
    if (!$id) respond(['error' => 'Invalid ID.'], 400);

    $stmt = $db->prepare("DELETE FROM classrooms WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    respond(['message' => 'Classroom removed.']);
}

respond(['error' => 'Method not allowed.'], 405);
