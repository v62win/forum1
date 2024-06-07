const express = require("express");
const cors = require("cors");
const connectDB = require('../database/db'); // Import connectDB correctly
const User = require('../database/userModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
console.log(typeof connectDB); // This should output 'function'

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);

app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        if (user) {
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                message: "Account created successfully!",
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "This email doesn't exist in our database" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.status(200).json({  id: user._id, message: "Successfully logged in" });
        } else {
            return res.status(400).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Server error" });
    }
});


const filePath = path.join(__dirname, "thread_list.json");
let threadList = [];

// Load thread list from disk at startup
const loadThreadList = () => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      threadList = JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading thread list:", error);
    threadList = [];
  }
};

// Save thread list to disk
const saveThreadList = () => {
  fs.writeFileSync(filePath, JSON.stringify(threadList, null, 4));
};

const addThread = (thread) => {
  thread.replies = [];
  thread.likes = [];
  threadList.unshift(thread);
  saveThreadList();
};

const getAllThreads = () => {
    return threadList.map((thread) => ({
        threadId: thread.threadId,
        userId: thread.userId,
        thread: thread.thread,
        createdAt: thread.createdAt,
      }));
};

// Create a Thread model class
class Thread {
  constructor(threadId, userId, thread, createdAt) {
    this.threadId = threadId;
    this.userId = userId;
    this.thread = thread;
    this.createdAt = createdAt;
  }
}

app.post("/api/create/thread", (req, res) => {
  const { thread, userId } = req.body;
  const threadId = generateID();

  const newThread = new Thread(
    threadId,
    userId,
    thread,
    new Date().toISOString()
  );

  addThread(newThread);

  res.status(201).json({
    message: "Thread created successfully",
    thread: getAllThreads()
  });
});

app.get("/api/all/threads", (req, res) => {
    res.json(getAllThreads());
  });
  
  // Load thread list at startup
  loadThreadList();

app.get("/api", (req, res) => {
    res.json({
        message: "blyat",
    });
});

// Call connectDB before starting the server
connectDB();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


