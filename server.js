const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// Register route
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Simulate registration success (Replace with your actual logic)
    res.status(201).json({ message: "User registered successfully!" });
});

// Server listens on port 8000
app.listen(8000, () => {
    console.log("Server is running on http://127.0.0.1:8000");
});
