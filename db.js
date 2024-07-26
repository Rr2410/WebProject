const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the timetable schema
const timetableSchema = new Schema({
  day: String, // e.g., Monday, Tuesday
  startTime: String, // e.g., "09:00"
  endTime: String, // e.g., "10:00"
  course: String, // e.g., "Math 101"
  location: String, // e.g., "Room 203"
  expirationDate: { type: Date, required: true } // Expiration date for the timetable entry
});

// Define the user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timetable: [timetableSchema], // Array of timetable objects
  notes: [String], // Array of notes
  dob: { type: Date, required: true },
  major: { type: String, required: true }
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;

