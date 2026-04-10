import { collection, addDoc, getDocs, deleteDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './config.js';

const dummyUsers = [
  { name: 'Admin User', email: 'admin@campus-connect.edu', role: 'Admin', createdAt: new Date('2023-01-15T10:00:00') },
  { name: 'Alice Smith', email: 'alice@student.edu', role: 'Member', createdAt: new Date('2023-02-12T14:30:00') },
  { name: 'Bob Jones', email: 'bob@student.edu', role: 'Member', createdAt: new Date('2023-03-05T09:15:00') },
  { name: 'Charlie Davis', email: 'charlie@student.edu', role: 'Member', createdAt: new Date('2023-04-20T11:45:00') }
];

const dummyClubs = [
  { name: 'Computer Science Club', description: 'For tech enthusiasts and coders.', createdAt: new Date('2023-01-20T10:00:00') },
  { name: 'Photography Society', description: 'Capturing campus moments.', createdAt: new Date('2023-02-15T10:00:00') },
  { name: 'Debate Team', description: 'Mastering the art of argumentation.', createdAt: new Date('2023-03-10T10:00:00') }
];

const seedData = async () => {
  try {
    console.log("Starting database seed...");
    // WARNING: This script DOES NOT clear existing data. It appends dummy data.
    
    // Seed Users
    const userRefs = [];
    for (const user of dummyUsers) {
      const docRef = await addDoc(collection(db, 'users'), user);
      userRefs.push(docRef.id);
    }
    console.log(`✅ Seeded ${dummyUsers.length} Users.`);

    // Seed Clubs
    const clubRefs = [];
    for (const club of dummyClubs) {
      const docRef = await addDoc(collection(db, 'clubs'), club);
      clubRefs.push(docRef.id);
    }
    console.log(`✅ Seeded ${dummyClubs.length} Clubs.`);

    // Seed Events
    const dummyEvents = [
      { title: 'Hackathon 2023', date: '2023-11-15T09:00', clubId: clubRefs[0], createdAt: new Date('2023-10-01T10:00:00') },
      { title: 'Intro to React', date: '2023-09-20T18:00', clubId: clubRefs[0], createdAt: new Date('2023-09-05T10:00:00') },
      { title: 'Campus Photo Walk', date: '2023-10-10T15:00', clubId: clubRefs[1], createdAt: new Date('2023-09-25T10:00:00') },
      { title: 'Annual Debate Tournament', date: '2023-12-05T10:00', clubId: clubRefs[2], createdAt: new Date('2023-11-01T10:00:00') }
    ];

    const eventRefs = [];
    for (const evt of dummyEvents) {
      const docRef = await addDoc(collection(db, 'events'), evt);
      eventRefs.push(docRef.id);
    }
    console.log(`✅ Seeded ${dummyEvents.length} Events.`);

    // Seed Registrations
    const dummyRegistrations = [
      { userId: userRefs[1], eventId: eventRefs[0], createdAt: new Date('2023-10-05T10:00:00') },
      { userId: userRefs[2], eventId: eventRefs[0], createdAt: new Date('2023-10-06T14:00:00') },
      { userId: userRefs[3], eventId: eventRefs[1], createdAt: new Date('2023-09-10T09:00:00') },
      { userId: userRefs[1], eventId: eventRefs[2], createdAt: new Date('2023-10-01T11:00:00') }
    ];

    for (const reg of dummyRegistrations) {
      await addDoc(collection(db, 'registrations'), reg);
    }
    console.log(`✅ Seeded ${dummyRegistrations.length} Registrations.`);
    
    console.log("🎉 Database Seed Completed Successfully!");

  } catch (error) {
    console.error("❌ Error seeding database: ", error);
  }
};

// To run this:
// Add a button in your app that calls seedData() internally, 
// OR run it via node after configuring firebase-admin.
// Exporting it here so you can temporarily import and call it in App.jsx if needed.
export default seedData;
