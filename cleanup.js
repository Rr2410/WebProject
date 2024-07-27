const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./userSchema'); 

// this file periodically removes expired timetable entries from the database
mongoose.connect('mongodb://localhost:27017/DBweb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


cron.schedule('0 0 * * *', async () => { 
  console.log('Running timetable cleanup job...');
  
  try {
  
    const result = await User.updateMany(
      { 'timetable.expirationDate': { $lt: new Date() } },
      { $pull: { timetable: { expirationDate: { $lt: new Date() } } } }
    );

    console.log('Cleanup result:', result);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
