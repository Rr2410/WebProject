// express.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./userSchema'); 
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3003;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/DBweb');
app.use(express.static(path.join(__dirname)));

// code to register a new user
app.get('/', (req, res) => {
    res.sendFile(__dirname, 'registerNew.html');
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
    res.status(500).send('error! try again later.');
  }
});
//end of code to register a new user

//code to login a user
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
  
      console.log('Login successful');
      res.redirect('/viewAccount.html');
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('error! try again later.');
    }
  });
  
//end of code to login a user

//code to add a timetable entry





//end of code to add a timetable entry


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



