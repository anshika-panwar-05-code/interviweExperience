
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Schema } = mongoose;
const User = require('./models/User');
const Submission = require('./models/submission');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend requests from localhost:3000
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

app.use(express.json());  

const PORT = 5000;
const JWT_SECRET = 'secret';  

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/interview_experience', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;  
    next();
  });
};



// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Create a submission
app.post('/submissions', authenticate, async (req, res) => {
  const { name, country, company, questions } = req.body;
  try {
    const newSubmission = new Submission({
      name,
      country,
      company,
      questions,
      userId: req.user.id,
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (err) {
    res.status(400).json({ message: 'Error creating submission', error: err.message });
  }
});

// Get all submissions
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().populate('userId', 'username');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submissions', error: err.message });
  }
});

// Get a specific submission
app.get('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, userId: req.user.id });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submission', error: err.message });
  }
});

// Edit a submission
app.put('/submissions/:id', authenticate, async (req, res) => {
    const { name, country, company, questions } = req.body;
    try {
      // Find and update submission only if it's owned by the authenticated user
      const updatedSubmission = await Submission.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { name, country, company, questions },
        { new: true } 
      );
      if (!updatedSubmission) return res.status(404).json({ message: 'Submission not found or not authorized' });
      res.json(updatedSubmission);
    } catch (err) {
      res.status(500).json({ message: 'Error updating submission', error: err.message });
    }
  });
  
// Delete a submission
app.delete('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting submission', error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
