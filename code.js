const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./userSchema');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Ensure dotenv is loaded before usage

const app = express();
const port = 3003;

// Setup middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/DBweb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.join(__dirname)));

// Configure session management with MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/DBweb' })
}));

// Route to handle form submission for adding a course
// Route to handle form submission for adding a course
app.post('/addcourse', async (req, res) => {
  console.log('Received request at /addcourse');

  if (!req.session.user) {
    console.error('Unauthorized access attempt');
    return res.status(401).send('Unauthorized');
  }

  const { email } = req.session.user;
  const { code, title, hours, day, from, to, location } = req.body;

  console.log('Request body:', req.body);

  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log('User found:', user);

      user.timetable.push({
        day: day,
        startTime: from,
        endTime: to,
        courseCode: code,
        courseTitle: title,
        location: location,
        creditHours: hours,
        expirationDate: new Date() 
      });

      await user.save();
      console.log('Course added successfully');
      res.redirect('/timetable.html');
    } else {
      console.error('User not found');
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error in /addcourse route:', error);
    res.status(500).send('Server error');
  }
});


// Code to register a new user
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registerNew.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { name, dob, major, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      dob,
      major,
      email,
      password: hashedPassword,
      timetable: [],
      notes: []
    });
    await newUser.save();
    res.redirect('/viewaccount.html');
  } catch (error) {
    res.status(500).send('Error! Try again later.');
  }
});

// Code to login a user
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      console.error('Login error: User not found');
      return res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validity:', isPasswordValid);

    if (!isPasswordValid) {
      console.error('Login error: Invalid password');
      return res.status(400).send('Invalid password');
    }

    req.session.user = { email: user.email };
    res.redirect('/viewAccount.html');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error! Try again later.');
  }
});

// Route to fetch timetable data
app.get('/timetable-data', async (req, res) => {
  if (!req.session.user) {
      return res.status(401).send('Unauthorized');
  }

  const { email } = req.session.user;

  try {
      const user = await User.findOne({ email });

      if (user) {
          res.json(user.timetable);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

