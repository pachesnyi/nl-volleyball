# Volleyball Match Booking Application - Comprehensive Specification

## 1. Project Overview

**Purpose**: Build a mobile-friendly volleyball match booking application for managing games, players, and payments.

**Target Users**: Dutch volleyball community with three distinct user roles
**Primary Platform**: Web-based (mobile-first responsive design)
**Technology Stack**: Next.js 14, React 18, Material UI v5, Tailwind CSS, Firebase

## 2. Technical Migration Requirements

### 2.1 UI Library Migration
- **FROM**: NextUI → **TO**: Material UI (MUI) v5
- **Styling**: Tailwind CSS for utilities + MUI `sx` properties for components
- **Theme**: Custom MUI theme with volleyball-specific branding
- **Mobile-First**: All components must be responsive and touch-friendly

### 2.2 Technology Stack
```
Frontend:  Next.js 14 (App Router), React 18, TypeScript
UI/UX:     Material UI v5, Tailwind CSS, React Hook Form
Backend:   Firebase (Auth, Firestore, Cloud Functions)
Payments:  Tikkie integration (manual for MVP)
Hosting:   Vercel (frontend) + Firebase (backend services)
```

## 3. User Management System

### 3.1 User Types & Permissions

#### **Guest Users**
- **Access**: View upcoming matches only
- **Restrictions**: Cannot join games or modify data
- **Registration**: Must be approved by admin to become registered user
- **Use Cases**:
  - Browse upcoming volleyball matches
  - View game details (time, location, available spots)
  - See who's already registered
  - Request registration approval

#### **Registered Users**
- **Access**: Full game participation features
- **Capabilities**:
  - Join/leave games (within game limits)
  - Access waiting list when game is full
  - Mark personal status (payment completed, bringing speaker/ball)
  - View payment links and game details
  - Manage personal profile and game history
- **Use Cases**:
  - Quick game registration/cancellation
  - Payment tracking and completion
  - Equipment coordination (speaker, ball)
  - Game history and statistics

#### **Admin Users**
- **Access**: Complete system management
- **Capabilities**:
  - User management (approve guests → registered users)
  - Game lifecycle (create, modify, archive, cancel)
  - Payment oversight and manual Tikkie link creation
  - System settings and configurations
- **Use Cases**:
  - Weekly game scheduling
  - User approval workflows
  - Payment reconciliation
  - System maintenance

### 3.2 Authentication & Security
- **Firebase Authentication** with email/password and Google OAuth
- **Role-based access control** with middleware protection
- **Session management** with JWT tokens
- **Profile verification** required for user approval

## 4. Game Management System

### 4.1 Game Structure

#### Core Game Properties
```typescript
interface Game {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    googleMapsUrl?: string;
  };
  maxPlayers: number;
  pricePerPlayer: number;
  tikkieLink?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdBy: string; // admin user ID
  createdAt: Date;
  updatedAt: Date;
}
```

#### Player Management
```typescript
interface GameParticipation {
  gameId: string;
  userId: string;
  joinedAt: Date;
  status: 'registered' | 'waiting_list';
  paymentCompleted: boolean;
  bringSpeaker: boolean;
  bringBall: boolean;
  notes?: string;
}
```

### 4.2 Game Features

#### **Player Lists**
- **Main List**: Players who secured spots (up to `maxPlayers`)
- **Waiting List**: Players who join after game is full
- **Auto-promotion**: Waiting list players move up when others leave

#### **Equipment Coordination**
- **Speaker checkbox**: Player commits to bringing sound system
- **Ball checkbox**: Player commits to bringing volleyball
- **Visual indicators**: Show equipment status in game overview

#### **Payment Integration**
- **Manual Tikkie links**: Admin creates and adds to game
- **Payment tracking**: Players self-report payment completion
- **Payment overview**: Admin dashboard shows payment status

#### **Location Management**
- **Venue details**: Name, full address, capacity
- **Map integration**: Optional Google Maps links
- **Venue reuse**: Save common locations for quick selection

## 5. User Stories & Workflows

### 5.1 Guest User Journey
```
1. Land on homepage → View upcoming games
2. Click game details → See full information but no join button
3. Click "Request Access" → Fill registration form
4. Wait for admin approval → Receive email notification
5. Approved → Can now join games as registered user
```

### 5.2 Registered User Journey
```
1. Login → View dashboard with upcoming games
2. Click "Join Game" → Instant registration (if space available)
3. If full → Added to waiting list with position indicator
4. Mark equipment checkboxes → Update game coordination
5. Complete payment via Tikkie → Mark payment as completed
6. Game day → Check final player list and details
```

### 5.3 Admin User Journey
```
1. Login → Admin dashboard with game overview
2. Create new game → Set all parameters + generate Tikkie
3. Manage pending registrations → Approve/reject guest users
4. Monitor game participation → View payment status
5. Game management → Edit/cancel/archive games as needed
```

## 6. Database Schema (Firebase Firestore)

### 6.1 Collections Structure
```
/users/{userId}
  - email: string
  - displayName: string
  - role: 'guest' | 'registered' | 'admin'
  - status: 'pending' | 'approved' | 'suspended'
  - profile: UserProfile
  - createdAt: timestamp
  - updatedAt: timestamp

/games/{gameId}
  - [Game properties as defined above]
  - participants: GameParticipation[]
  - waitingList: GameParticipation[]

/gameParticipation/{participationId}
  - [GameParticipation properties as defined above]

/systemSettings/{settingKey}
  - value: any
  - updatedBy: string
  - updatedAt: timestamp
```

### 6.2 Security Rules
- **Guest users**: Read access to games only
- **Registered users**: Read games + write own participations
- **Admin users**: Full read/write access
- **Data validation**: Enforce schema constraints

## 7. API Endpoints & Cloud Functions

### 7.1 Authentication Endpoints
```
POST /api/auth/register     - New user registration
POST /api/auth/login        - User authentication
POST /api/auth/logout       - Session termination
GET  /api/auth/profile      - Current user profile
PUT  /api/auth/profile      - Update user profile
```

### 7.2 Game Management Endpoints
```
GET    /api/games           - List games (filtered by user role)
GET    /api/games/{id}      - Get game details
POST   /api/games           - Create new game (admin only)
PUT    /api/games/{id}      - Update game (admin only)
DELETE /api/games/{id}      - Cancel game (admin only)
```

### 7.3 Participation Endpoints
```
POST   /api/games/{id}/join      - Join game or waiting list
DELETE /api/games/{id}/leave     - Leave game
PUT    /api/games/{id}/status    - Update payment/equipment status
```

### 7.4 Admin Endpoints
```
GET  /api/admin/users           - List all users
PUT  /api/admin/users/{id}/role - Update user role
GET  /api/admin/games/stats     - Game statistics
POST /api/admin/games/bulk      - Bulk game operations
```

## 8. UI/UX Specifications

### 8.1 Design System
- **Material UI Theme**: Custom volleyball-themed palette
- **Typography**: Roboto font family, clear hierarchy
- **Colors**: 
  - Primary: Volleyball orange (#FF6B35)
  - Secondary: Court blue (#2196F3)
  - Success: Payment green (#4CAF50)
  - Warning: Waiting list amber (#FF9800)

### 8.2 Mobile-First Components

#### **Homepage**
```
- Header: Logo + User menu/login
- Game cards: Upcoming games in timeline format
- Quick actions: Join next game, view profile
- Bottom navigation: Home, My Games, Profile, Admin
```

#### **Game Card Component**
```
- Game title and date/time
- Location with map link
- Player count (X/Y registered + Z waiting)
- Equipment status indicators
- Join/Leave button with loading states
- Payment status indicator
```

#### **Game Details Page**
```
- Full game information
- Player list with equipment commitments
- Waiting list (if applicable)
- Payment section with Tikkie link
- Equipment coordination checkboxes
- Admin controls (if admin user)
```

### 8.3 Responsive Breakpoints
- **Mobile**: 320px - 768px (primary focus)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+ (enhanced features)

## 9. Payment System

### 9.1 Current Implementation (MVP)
- **Manual Tikkie Integration**:
  - Admin creates Tikkie payment requests outside app
  - Admin manually adds Tikkie links to games
  - Players click link → Complete payment externally
  - Players manually mark payment as completed in app

### 9.2 Payment Workflow
```
1. Admin creates game → Generates Tikkie link manually
2. Admin adds Tikkie link to game details
3. Players join game → See payment required
4. Players click Tikkie link → External payment
5. Players return → Mark payment as completed
6. Admin reviews → Payment status overview
```

### 9.3 Future Enhancements
- **Automated Tikkie API**: Direct integration with Tikkie
- **Alternative payments**: iDEAL, PayPal, credit cards
- **Split payments**: Group payment options
- **Refund handling**: Automated cancellation refunds

## 10. Technical Implementation Priority

### 10.1 Phase 1: Core MVP (Weeks 1-3)
1. **Setup & Migration**:
   - NextUI → Material UI migration
   - Firebase configuration
   - Authentication system
   - Basic routing and layout

2. **User Management**:
   - Three-tier user system
   - Registration and approval workflow
   - Profile management

3. **Basic Game Features**:
   - Game creation and listing
   - Join/leave functionality
   - Player lists and waiting lists

### 10.2 Phase 2: Enhanced Features (Weeks 4-6)
1. **Payment Integration**:
   - Manual Tikkie link management
   - Payment status tracking
   - Admin payment overview

2. **Equipment Coordination**:
   - Speaker/ball checkboxes
   - Equipment status indicators
   - Game coordination features

3. **Mobile Optimization**:
   - Responsive design refinement
   - Touch-friendly interactions
   - Performance optimization

### 10.3 Phase 3: Advanced Features (Weeks 7+)
1. **Admin Dashboard**:
   - User management interface
   - Game analytics and reporting
   - Bulk operations

2. **Enhanced UX**:
   - Push notifications
   - Calendar integration
   - Game history and statistics

3. **Future Integrations**:
   - Automated payment processing
   - Advanced scheduling features
   - Social features and team building

## 11. Testing & Quality Assurance

### 11.1 Testing Strategy
- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows (Playwright)
- **Mobile Testing**: Real device testing on iOS/Android

### 11.2 Performance Requirements
- **Page Load**: < 2 seconds on 3G connection
- **Time to Interactive**: < 3 seconds
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 11.3 Accessibility
- **WCAG 2.1 Level AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support

## 12. Deployment & DevOps

### 12.1 Environment Setup
- **Development**: Local development with Firebase emulators
- **Staging**: Vercel preview deployments + Firebase staging
- **Production**: Vercel production + Firebase production environment

### 12.2 CI/CD Pipeline
```
1. Code push → GitHub Actions trigger
2. Run tests → Lint, type check, unit tests
3. Build application → Next.js production build
4. Deploy to staging → Automatic preview deployment
5. Manual approval → Deploy to production
6. Post-deployment → Smoke tests and monitoring
```

### 12.3 Monitoring & Analytics
- **Error Tracking**: Firebase Crashlytics
- **Performance**: Vercel Analytics + Core Web Vitals
- **User Analytics**: Firebase Analytics (privacy-compliant)
- **Uptime Monitoring**: Firebase Hosting monitoring

This comprehensive specification provides a complete roadmap for building the volleyball match booking application with all requirements, technical details, and implementation phases clearly defined.
