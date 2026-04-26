const express = require("express");
const mysql = require("mysql2");
const app = express();

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mosin098123@12", // your password
  database: "villages_db"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// 🟢 Get all villages (sorted + pretty output)
app.get("/villages", (req, res) => {
  db.query(
    "SELECT * FROM villages ORDER BY village LIMIT 100",
    (err, result) => {
      if (err) return res.send(err);
      res.send(JSON.stringify(result, null, 2));
    }
  );
});

// 🟢 Filter by state
app.get("/villages/state/:state", (req, res) => {
  db.query(
    "SELECT * FROM villages WHERE LOWER(state)=LOWER(?) ORDER BY village LIMIT 100",
    [req.params.state],
    (err, result) => {
      if (err) return res.send(err);
      res.send(JSON.stringify(result, null, 2));
    }
  );
});

// 🟢 Search village
app.get("/search/:name", (req, res) => {
  db.query(
    "SELECT * FROM villages WHERE LOWER(village) LIKE LOWER(?) ORDER BY village LIMIT 100",
    [`%${req.params.name}%`],
    (err, result) => {
      if (err) return res.send(err);
      res.send(JSON.stringify(result, null, 2));
    }
  );
});

// 🟢 Home route
app.get("/", (req, res) => {
  res.send("🚀 Village API with MySQL is running!");
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});