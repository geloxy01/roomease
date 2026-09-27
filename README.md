# RoomEase — React + XAMPP

Classroom Availability & Scheduling System  
React frontend connected to a PHP + MySQL backend on XAMPP.

---

## Folder Structure

```
RoomEase-Full/
├── api/               ← Copy this entire folder into htdocs
│   ├── config.php
│   ├── auth.php
│   ├── classrooms.php
│   ├── schedules.php
│   ├── users.php
│   └── roomease.sql   ← Import this in phpMyAdmin
└── react/             ← Your React project
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup Instructions

### Step 1 — Import the Database
1. Open phpMyAdmin → `http://localhost/phpmyadmin`
2. Click **Import** → choose `api/roomease.sql` → click **Go**

### Step 2 — Copy API to XAMPP
Copy the `api/` folder into:
```
C:\xampp\htdocs\RoomEase-Full\api\
```

### Step 3 — Start XAMPP
Open XAMPP Control Panel → Start **Apache** and **MySQL**

### Step 4 — Run React
```bash
cd react
pnpm install
pnpm run dev
```
Open → http://localhost:5173

---

## Default Admin Account

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

---

## API Endpoints

All endpoints live at `http://localhost/RoomEase-Full/api/`

| File             | Methods           | Purpose                  |
|------------------|-------------------|--------------------------|
| auth.php         | POST              | Login, Register          |
| classrooms.php   | GET POST PUT DELETE | Manage classrooms      |
| schedules.php    | GET POST DELETE   | Manage schedules         |
| users.php        | GET PUT DELETE    | Manage users / password  |
