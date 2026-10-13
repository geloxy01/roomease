<?php
require_once 'config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $sql = "SELECT s.*, u.fullname AS teacher_name, c.room_name
            FROM schedules s
            JOIN users u ON s.teacher_id = u.id
            JOIN classrooms c ON s.classroom_id = c.id
            ORDER BY s.schedule_date ASC, s.start_time ASC";
    $result    = $db->query($sql);
    $schedules = $result->fetch_all(MYSQLI_ASSOC);
    respond($schedules);
}

$body = getBody();

if ($method === 'POST') {
    $classroom_id  = intval($body['classroom_id'] ?? 0);
    $teacher_id    = intval($body['teacher_id'] ?? 0);
    $subject       = trim($body['subject'] ?? '');
    $schedule_date = $body['schedule_date'] ?? '';
    $day           = $body['day'] ?? '';
    $start_time    = $body['start_time'] ?? '';
    $end_time      = $body['end_time'] ?? '';

    if (!$classroom_id || !$teacher_id || !$subject || !$schedule_date || !$day || !$start_time || !$end_time) {
        respond(['error' => 'Please fill in all fields.'], 400);
    }

    if ($start_time >= $end_time) {
        respond(['error' => 'End time must be after start time.'], 400);
    }

    $stmt = $db->prepare("
        SELECT id FROM schedules
        WHERE classroom_id = ?
          AND schedule_date = ?
          AND (
            (start_time < ? AND end_time > ?)
          )
    ");
    $stmt->bind_param("isss", $classroom_id, $schedule_date, $end_time, $start_time);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond(['error' => 'Conflict detected. This room is already booked at that date and time.'], 409);
    }

    $stmt = $db->prepare("INSERT INTO schedules (classroom_id, teacher_id, subject, schedule_date, day, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssss", $classroom_id, $teacher_id, $subject, $schedule_date, $day, $start_time, $end_time);

    if ($stmt->execute()) {
        $id   = $db->insert_id;
        $row  = $db->query("SELECT s.*, u.fullname AS teacher_name, c.room_name FROM schedules s JOIN users u ON s.teacher_id = u.id JOIN classrooms c ON s.classroom_id = c.id WHERE s.id = $id")->fetch_assoc();
        respond($row);
    } else {
        respond(['error' => 'Failed to save schedule.'], 500);
    }
}

if ($method === 'DELETE') {
    $id = intval($body['id'] ?? 0);
    if (!$id) respond(['error' => 'Invalid ID.'], 400);

    $stmt = $db->prepare("DELETE FROM schedules WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    respond(['message' => 'Schedule removed.']);
}

respond(['error' => 'Method not allowed.'], 405);
