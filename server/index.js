const express = require("express");
const cors = require("cors");
const connectDB = require('../database/db'); // Import connectDB correctly
const User = require('../database/userModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { title } = require("process");
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
            return res.status(200).json({  id: user._id, you: user.username, message: "Successfully logged in" });
        } else {
            return res.status(400).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Server error" });
    }
});


const filePath = path.join(__dirname, "thread_list.json");

// Read thread list from disk
const readThreadList = () => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading thread list:", error);
    return [];
  }
};

// Write thread list to disk
const writeThreadList = (threadList) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(threadList, null, 4));
  } catch (error) {
    console.error("Error writing thread list:", error);
  }
};

const addThread = (thread) => {
  const threadList = readThreadList();
  thread.replies = [];
  thread.likes = [];
  threadList.unshift(thread);
  writeThreadList(threadList);
};

const getAllThreads = () => {
  const threadList = readThreadList();
  return threadList.map((thread) => ({
    threadId: thread.threadId,
    userId: thread.userId,
    thread: thread.thread,
    createdAt: thread.createdAt,
    likes: thread.likes,
    replies: thread.replies,
  }));
};

// Create a Thread model class
class Thread {
  constructor(threadId, userId, thread, createdAt) {
    this.threadId = threadId;
    this.userId = userId;
    this.thread = thread;
    this.createdAt = createdAt;
    this.likes = [];
    this.replies = [];
  }
}

app.post("/api/create/thread", async (req, res) => {
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

app.get("/api/all/threads", async (req, res) => {
  await res.json(getAllThreads());
});

app.post("/api/thread/like", async (req, res) => {
  const { threadId, userId } = req.body;

  const threadList = await readThreadList();

  const threadIndex = await threadList.findIndex((thread) => thread.threadId === threadId);


  if (threadIndex === -1) {
    return res.status(404).json({ message: "Thread not found" });
  }

  const userLiked = threadList[threadIndex].likes.includes(userId);
  if (userLiked) {
    // Remove the like if the user has already liked the thread
   threadList[threadIndex].likes = threadList[threadIndex].likes.filter((likeUserId) => likeUserId !== userId);
  } else {
    // Add the like if the user has not liked the thread
    await threadList[threadIndex].likes.push(userId);
  }

  writeThreadList(threadList); // Save the updated thread list to disk

  res.status(200).json({ message: "Like updated successfully" });
});

app.post("/api/thread/replies", async (req, res) => {
  const { threadId } = req.body;
  
  const threadList = await readThreadList();

  const thread = threadList.find((thread) => thread.threadId === threadId);

  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }

  res.json({
    replies: thread.replies,
    thread: thread.thread,
  });
});
app.post("/api/create/reply", async (req, res) => {
  const { threadId, userId, reply, name } = req.body;
  const threadList = await readThreadList();
  const thread = threadList.find((thread) => thread.threadId === threadId);
  
  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }
  const th = threadList.find((thread) => thread.userId === userId);
  if (!th) {
    return res.status(404).json({ message: "user not found" });
  }

    const replyId = generateID();
    const newReply = {
      name,
      replyId,
      userId,
      reply,
      createdAt: new Date().toISOString(),
    };
    thread.replies.push(newReply);
    writeThreadList(threadList);
    res.json({
      message: "Response added successfully!",
  });

});
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


