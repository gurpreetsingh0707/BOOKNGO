const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-platform')
  .then(async () => {
    // Update the most recently created user to be an admin
    const user = await User.findOneAndUpdate(
        {}, 
        { role: 'admin' }, 
        { sort: { createdAt: -1 }, new: true }
    );
    if(user) {
      console.log(`✅ Success! Updated user ${user.email} to have the 'admin' role.`);
    } else {
      console.log("❌ No users found in the database. Please register a user first.");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
