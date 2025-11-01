import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import your Adventure model
import Adventure from "./src/models/experience.model"; // adjust path according to your project

// Adventures data
const adventures = [
  {
    title: "Sky Diving Adventure",
    description: "Experience the thrill of free fall over the beaches of Goa.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Goa",
    price: 5000,
    slots: [
      { date: "2025-11-01", time: "10:00 AM", capacity: 5, booked: 2 },
      { date: "2025-11-01", time: "2:00 PM", capacity: 3, booked: 3 },
    ],
  },
  {
    title: "Scuba Diving Experience",
    description: "Dive into the deep blue and explore coral reefs and marine life.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Andaman Islands",
    price: 7500,
    slots: [
      { date: "2025-11-03", time: "9:00 AM", capacity: 8, booked: 5 },
      { date: "2025-11-04", time: "1:00 PM", capacity: 6, booked: 3 },
    ],
  },
  {
    title: "Hot Air Balloon Ride",
    description: "Fly over the Aravalli Hills and witness sunrise from the skies.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Jaipur",
    price: 4500,
    slots: [
      { date: "2025-11-05", time: "6:00 AM", capacity: 10, booked: 4 },
      { date: "2025-11-06", time: "6:00 AM", capacity: 10, booked: 7 },
    ],
  },
  {
    title: "Desert Safari Experience",
    description: "Ride across sand dunes and enjoy cultural performances at sunset.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Jaisalmer",
    price: 3200,
    slots: [
      { date: "2025-11-07", time: "4:00 PM", capacity: 12, booked: 10 },
      { date: "2025-11-08", time: "5:00 PM", capacity: 12, booked: 8 },
    ],
  },
  {
    title: "Trekking Expedition",
    description: "Explore the scenic trails of the Himalayas with expert guides.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Manali",
    price: 6000,
    slots: [
      { date: "2025-11-10", time: "7:00 AM", capacity: 15, booked: 9 },
      { date: "2025-11-11", time: "7:00 AM", capacity: 15, booked: 12 },
    ],
  },
  {
    title: "River Rafting Adventure",
    description: "Battle the rapids with trained professionals for an adrenaline rush.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Rishikesh",
    price: 3500,
    slots: [
      { date: "2025-11-02", time: "10:00 AM", capacity: 8, booked: 6 },
      { date: "2025-11-02", time: "3:00 PM", capacity: 8, booked: 5 },
    ],
  },
  {
    title: "Paragliding Experience",
    description: "Soar over the hills and enjoy a bird’s-eye view of the valley.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Bir Billing",
    price: 4000,
    slots: [
      { date: "2025-11-12", time: "11:00 AM", capacity: 5, booked: 3 },
      { date: "2025-11-12", time: "2:00 PM", capacity: 5, booked: 5 },
    ],
  },
  {
    title: "Kayaking in Backwaters",
    description: "Paddle through calm waters surrounded by lush greenery.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Alleppey",
    price: 2800,
    slots: [
      { date: "2025-11-03", time: "9:00 AM", capacity: 6, booked: 2 },
      { date: "2025-11-03", time: "4:00 PM", capacity: 6, booked: 6 },
    ],
  },
  {
    title: "Bungee Jumping",
    description: "Take a leap of faith from a 150-ft tower — adrenaline guaranteed!",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Rishikesh",
    price: 4200,
    slots: [
      { date: "2025-11-09", time: "11:00 AM", capacity: 5, booked: 4 },
      { date: "2025-11-09", time: "1:00 PM", capacity: 5, booked: 5 },
    ],
  },
  {
    title: "Mountain Biking Trail",
    description: "Conquer rugged mountain trails with professional guidance.",
    image: "https://seahawksscuba.in/wp-content/uploads/2024/09/Fish-Point-scuba-dive.jpg",
    location: "Leh-Ladakh",
    price: 6500,
    slots: [
      { date: "2025-11-15", time: "8:00 AM", capacity: 10, booked: 8 },
      { date: "2025-11-16", time: "8:00 AM", capacity: 10, booked: 10 },
    ],
  }
];

// Connect to MongoDB
const seedDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://chachahamarevidhhayak147_db_user:hEpIxIPqgUCmcfyG@cluster0.aywk94r.mongodb.net/?appName=Cluster0");
    console.log("💾 Connected to MongoDB");

    // Clear existing data
    await Adventure.deleteMany({});
    console.log("🗑 Cleared existing adventures");

    // Insert new data
    await Adventure.insertMany(adventures);
    console.log("✅ Adventures seeded successfully");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  }
};

// Run seeding
seedDB();
