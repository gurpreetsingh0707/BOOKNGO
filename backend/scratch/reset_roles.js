const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/BOOKNGO');
        const owner = 'nargourav54@gmail.com';
        
        // 1. Ensure owner is admin
        await User.findOneAndUpdate({ email: owner }, { role: 'admin' });
        
        // 2. Set everyone else to user
        const result = await User.updateMany(
            { email: { $ne: owner } }, 
            { role: 'user' }
        );
        
        console.log(`✅ Owner confirmed as Admin.`);
        console.log(`✅ ${result.modifiedCount} other users restricted to 'user' role.`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
