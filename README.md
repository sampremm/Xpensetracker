# Xpensetracker

A full-stack expense tracking application with a Node.js/TypeScript backend and an Expo React Native frontend.

## Features

- User authentication (signup, login, logout, token refresh)
- Expense management (create, read, delete expenses)
- Analytics summary for user expenses
- **Smart SMS Parser**: Automatic detection and categorization of banking SMS
- **Auto SMS Reading**: Background monitoring for transaction SMS (Android)
- **Bank-Specific Parsing**: Enhanced accuracy for SBI, HDFC, ICICI, Axis, and UPI transactions
- Real-time updates (WebSocket support)
- Secure storage for tokens on mobile
- Cross-platform mobile app (iOS, Android, Web)

## Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, bcrypt for password hashing
- **Real-time**: Socket.io
- **Validation**: Zod

### Frontend

- **Framework**: Expo React Native
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Charts**: React Native Chart Kit
- **Storage**: Expo Secure Store, AsyncStorage
- **HTTP Client**: Axios with automatic token refresh

## Project Structure

```
xpensetracker/
├── backend/                 # Node.js/TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── src/
│   │   ├── modules/         # Feature modules (auth, expenses, analytics)
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # JWT, hash, logger
│   │   └── config/          # DB and env config
│   ├── package.json
│   └── tsconfig.json
├── my-expo-app/             # Expo React Native app
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # Navigation setup
│   │   ├── context/         # React context (Auth)
│   │   ├── api/             # API client
│   │   └── utils/           # Secure store, SMS parser
│   ├── package.json
│   └── app.json
└── README.md
```

## Database Schema

- **User**: id, name, email, password, currency, timestamps
- **Expense**: id, title, amount, type (INCOME/EXPENSE), category, note, date, userId
- **RefreshToken**: id, token, userId, expiresAt

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Expenses (`/api/expenses`)

- `GET /api/expenses` - Get all user expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `DELETE /api/expenses/:id` - Delete expense

### Analytics (`/api/analytics`)

- `GET /api/analytics/summary` - Get expense summary/analytics

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file in `backend/`:

   ```env
   DATABASE_URL="your-postgresql-connection-string"
   PORT=4000
   JWT_SECRET="your-jwt-secret-key"
   REFRESH_SECRET="your-refresh-secret-key"
   ACCESS_TOKEN_EXPIRES="15m"
   REFRESH_TOKEN_EXPIRES_DAYS=7
   ```

4. Generate Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:4000`.

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd my-expo-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - `npm run ios` - iOS simulator
   - `npm run android` - Android emulator
   - `npm run web` - Web browser

## Development Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Frontend

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Lint and format code
- `npm run format` - Auto-fix linting issues

## Environment Configuration

### Backend (.env)

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 4000)
- `JWT_SECRET`: Secret for JWT access tokens
- `REFRESH_SECRET`: Secret for JWT refresh tokens
- `ACCESS_TOKEN_EXPIRES`: Access token expiration (default: 15m)
- `REFRESH_TOKEN_EXPIRES_DAYS`: Refresh token expiration in days (default: 7)

### Frontend

The frontend connects to `http://localhost:4000` by default. Update the `baseURL` in `my-expo-app/src/api/api.tsx` for different environments.

## SMS Parser Features

The app includes an intelligent SMS parser that automatically detects and categorizes banking transactions:

### Automatic SMS Reading (Android)

- **Background Monitoring**: Toggle automatic SMS detection in the SMS Parser tab
- **Permission-Based**: Requests SMS read permissions for seamless transaction tracking
- **Real-time Alerts**: Notifications when new transactions are detected

### Smart Transaction Detection

- **Bank-Specific Parsing**: Optimized patterns for major Indian banks (SBI, HDFC, ICICI, Axis)
- **UPI Transactions**: Support for UPI payment SMS from various apps
- **Multi-Currency**: Recognizes ₹, $, €, £ symbols and formats
- **Category Auto-Detection**: Automatically categorizes transactions (Food, Transport, Bills, etc.)

### Manual SMS Input

- **Paste & Parse**: Copy SMS messages and paste for instant parsing
- **Confidence Scoring**: Shows parsing accuracy percentage
- **Manual Editing**: Review and edit detected information before saving

### Supported Transaction Types

- **Income**: Salary, refunds, payments received, deposits
- **Expenses**: Bills, shopping, fuel, dining, entertainment, medical
- **Transfers**: NEFT, RTGS, IMPS, UPI transactions

Example SMS messages that can be parsed:

```
"Dear Customer, Your account has been credited with INR 5000.00 from ABC Corp"
"Transaction Alert: Debited INR 250.00 from your account for UPI payment to Restaurant XYZ"
"Payment received: You have received INR 2000.00 from John Doe via UPI"
```

## Deployment

### Backend

1. Build the application:
   ```bash
   npm run build
   ```
2. Set production environment variables
3. Run migrations on production database
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Build for production:
   ```bash
   expo build:android
   # or
   expo build:ios
   ```
2. Submit to app stores or distribute builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
