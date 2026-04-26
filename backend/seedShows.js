const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const dotenv = require('dotenv');

dotenv.config();

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const liveShows = [
      {
        title: "Arijit Singh Live Concert",
        description: "Experience the magic of Arijit Singh live in concert. A night of soul-stirring melodies.",
        genre: ["Music", "Concert"],
        rating: 4.9,
        language: "Hindi/English",
        duration: "3 hours",
        price: 2500,
        availableSeats: 500,
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
        category: "live_show"
      },
      {
        title: "Zakur Khan: Tathastu",
        description: "The biggest stand-up comedy show by Zakur Khan. Laugh your heart out!",
        genre: ["Comedy", "Stand-up"],
        rating: 4.8,
        language: "Hindi",
        duration: "1.5 hours",
        price: 1200,
        availableSeats: 300,
        image: "https://images.unsplash.com/photo-1514525253361-b83f859b71c0?w=800",
        category: "live_show"
      },
      {
        title: "Sunburn Festival Goa",
        description: "Asia's largest electronic dance music festival. 3 days of non-stop music.",
        genre: ["Music", "EDM", "Festival"],
        rating: 4.7,
        language: "English",
        duration: "72 hours",
        price: 5000,
        availableSeats: 1000,
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        category: "live_show"
      },
      {
        title: "Cirque du Soleil: Bazzar",
        description: "A breathtaking performance of acrobatics, music, and art. A must-see show.",
        genre: ["Circus", "Art", "Performance"],
        rating: 4.9,
        language: "None",
        duration: "2 hours",
        price: 3500,
        availableSeats: 400,
        image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800",
        category: "live_show"
      },
      {
        title: "International Magic Festival",
        description: "Witness the world's best magicians performing mind-bending illusions.",
        genre: ["Magic", "Illusion"],
        rating: 4.6,
        language: "English/Hindi",
        duration: "2 hours",
        price: 1500,
        availableSeats: 250,
        image: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=800",
        category: "live_show"
      }
    ];

    for (const show of liveShows) {
      await Movie.findOneAndUpdate(
        { title: show.title },
        show,
        { upsert: true, new: true }
      );
    }

    console.log('Successfully seeded live shows!');
    process.exit();
  } catch (error) {
    console.error('Error seeding shows:', error);
    process.exit(1);
  }
};

seedShows();
