<?php
// ── Database Configuration ──────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // XAMPP default
define('DB_PASS', '');           // XAMPP default (empty)
define('DB_NAME', 'roomease');

// ── CORS Headers (allow React dev server) ──────────────
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── DB Connection ───────────────────────────────────────
function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// ── Helper: send JSON response ──────────────────────────
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// ── Helper: get JSON body ───────────────────────────────
function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
