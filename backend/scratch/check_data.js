const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const count = await Movie.countDocuments();
    console.log('Total Movies in DB:', count);
    
    const movies = await Movie.find();
    movies.forEach(m => {
      console.log(`- ${m.title} | Category: ${m.category} | Active: ${m.isActive}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
