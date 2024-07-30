const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableSchema = new Schema({
  day: String, 
  startTime: String, 
  endTime: String, 
  courseCode: String, 
  courseTitle: String,
  location: String,
  creditHours: Number,
  expirationDate: { type: Date, required: true } 
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timetable: [timetableSchema], 
  notes: [String], 
  dob: { type: Date, required: true },
  major: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
