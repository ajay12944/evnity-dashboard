# Campus Club Management Dashboard

A modern, full-stack React Admin Dashboard for managing campus clubs, built with Vite, Tailwind CSS v4, Recharts, and Firebase (Auth + Firestore).

## Features
- **Dashboard Overview**: Summary statistics and interactive Recharts graphs.
- **Authentication**: Secure Admin login via Firebase Authentication.
- **Fully Responsive UI**: Modern Tailwind CSS interface that works seamlessly on Desktop and Tablet.
- **CRUD Management**: Detailed views to Create, Read, Update, and Delete:
  - Users
  - Clubs
  - Events
  - Event Registrations
- **Real-time capable**: Ready for Firebase snapshot listeners.

## Prerequisites
- Node.js (v18 or higher recommended)
- A Firebase Project (Firestore Databse & Authentication with Email/Password enabled)

## Setup Instructions

### 1. Clone & Install Dependencies
Navigate to the project directory and install the required NPM packages.

```bash
npm install
```

### 2. Configure Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (if you haven't already).
3. Enable **Authentication** (Email/Password provider).
4. Create a **Firestore Database** (Start in Test Mode for development).
5. Go to Project Settings -> General -> Your Apps, and add a Web App.
6. Copy the Firebase Configuration object.
7. Open `src/firebase/config.js` in this project and replace the `firebaseConfig` object with your actual keys.

### 3. Run the Development Server
```bash
npm run dev
```
Navigate to the localhost URL provided in your terminal (usually `http://localhost:5173`).

## Dummy Data Seeding
If you want to populate the charts and tables immediately:
1. Open `src/App.jsx`.
2. Import the seeder: `import seedData from './firebase/seed';`
3. Call `seedData()` once inside a `useEffect` on mount, let it run, then remove the call.
*(Alternative: Expose a hidden button in the UI that triggers this function)*

## Tech Stack
- Frontend: React 19, React Router v7, Tailwind CSS v4, Recharts, Lucide React
- Backend: Firebase SDK v11 (Authentication, Firestore)
- Bundler: Vite
