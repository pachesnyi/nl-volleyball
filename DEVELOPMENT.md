# Development Guide

## Mock Games for Testing

The app includes a development helper to easily populate the database with realistic test data.

### Using Mock Games

1. **Start the development server**: `npm run dev`
2. **Sign in as an admin** (make sure your user role is set to "admin" in Firestore)
3. **Look for the "DEV TOOLS" panel** in the bottom-right corner of the home page
4. **Click "Add Mock Games"** to populate the database with 4 sample games
5. **Click "Clear All Games"** to remove all games from the database (use with caution!)

### Mock Game Data

The mock games include:
- **Thursday Evening Volleyball** - Popular game with 4 players, 1 on waiting list
- **Weekend Beach Tournament** - Tournament format with 2 players registered  
- **Monday Morning Volleyball** - Empty game for testing registration flow
- **Friday Night Lights Volleyball** - Game with equipment coordination (ball + speaker)

Each mock game includes:
- Realistic dates (2-7 days in the future)
- Different locations around Netherlands
- Various player counts and payment statuses
- Equipment coordination examples
- Waiting list scenarios

### Development Notes

- Mock games are only available in development mode (`NODE_ENV=development`)
- The DEV TOOLS panel only appears for admin users
- Mock games include realistic player data for testing registration flows
- Use "Clear All Games" to reset the database when needed

## Testing Different User States

To test the different user experiences:

1. **Unauthorized User**: Sign out to see games with disabled overlay
2. **Guest User**: Set user role to "guest" in Firestore
3. **Approved User**: Set user role to "user" in Firestore  
4. **Admin User**: Set user role to "admin" in Firestore

Each state shows different UI and functionality:
- Unauthorized: Can view games but cannot register
- Guest: Can view games but registration disabled until approval
- User: Full registration access with equipment selection
- Admin: All features plus game management and creation tools