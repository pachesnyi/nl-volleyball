# Volleyball Matches App 🏐

A modern web application for registering and managing friendly volleyball matches. Built with Next.js, Firebase, and Framer Motion.

## Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **User Role Management** - Support for Admin, User, Guest, and Cherry roles
- **Responsive Design** - Clean, modern interface that works on all devices
- **Smooth Animations** - Delightful interactions powered by Framer Motion
- **Real-time Updates** - Firebase Firestore for live data synchronization

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Firebase project with Authentication and Firestore enabled
- Google OAuth credentials

### Installation

1. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

2. **Set up Firebase:**
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Get your Firebase configuration

3. **Configure environment variables:**
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## User Roles

- **Guest**: Can view upcoming games but cannot join until approved by admin
- **Cherry**: New members who can join games, pending permanent user status
- **User**: Approved members who can join games and manage their participation
- **Admin**: Full access to create games, manage users, and moderate content

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── lib/               # Firebase and utility functions
└── types/             # TypeScript type definitions
```

## Development

The application is built with modern React patterns and includes:

- Type-safe development with TypeScript
- Real-time data synchronization with Firebase
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- User role-based access control

## Next Steps

This is the first iteration (MVP) of the volleyball app. Future features to implement:

- Game creation and management
- Player registration and waiting lists
- Payment tracking with Tikkie integration
- Google Calendar integration
- Location management with Google Maps
- Admin panel for user management
- Email notifications

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types for new features
3. Test authentication flows with different user roles
4. Ensure responsive design on mobile devices
