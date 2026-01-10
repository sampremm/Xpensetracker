# Expense Tracker - Frontend Integration Guide

## ✅ Completed Integrations

### 1. **Backend Endpoint Compatibility**

All frontend API calls now match backend endpoints:

#### Authentication (`/api/auth`)

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login (returns accessToken, refreshToken, user)
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

#### Expenses (`/api/expenses`)

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense/income
- `DELETE /api/expenses/:id` - Delete expense

#### Analytics (`/api/analytics`)

- `GET /api/analytics/summary` - Get financial summary

**Response Format:**

```json
{
  "income": 50000,
  "expense": 15000,
  "balance": 35000,
  "categories": {
    "Food": 5000,
    "Transport": 3000,
    "Bills": 7000
  }
}
```

---

## 🆕 New Features Added

### 2. **SMS Message Parser (Smart Detection)**

**File:** `src/utils/smsParser.ts`

Automatically detects and parses SMS messages to extract:

- Transaction type (INCOME/EXPENSE)
- Amount
- Category
- Title/Description
- Confidence score

**Supported Keywords:**

- **Income:** received, credited, deposit, salary, payment received, refund, etc.
- **Expense:** spent, paid, debit, charged, purchase, withdrawal, etc.

**Supported Categories:**

- Food, Transport, Shopping, Bills, Entertainment, Health, Salary, Freelance, Investment

**Example Usage:**

```javascript
import { parseSMS } from "../utils/smsParser";

const result = parseSMS("Paid ₹500 for food at restaurant");
// Returns:
// {
//   type: "EXPENSE",
//   amount: 500,
//   title: "Paid for food at restaurant",
//   category: "Food",
//   confidence: 0.95
// }
```

---

### 3. **SMS Input Screen**

**File:** `src/screens/SMSInputScreen.tsx`

Features:

- Paste SMS/message text
- Click "Analyze Message" to auto-detect
- View detection results with confidence score
- Auto-fill form fields
- Manual edit capability
- Save transaction with one tap

**Flow:**

1. Paste SMS content
2. Click "Analyze Message"
3. Review auto-detected data
4. Toggle "Auto-fill form fields"
5. Click "Save Transaction"

---

### 4. **Transactions/Expenses List Screen**

**File:** `src/screens/ExpensesScreen.tsx`

Features:

- View all transactions (income & expense)
- Filter by type (ALL, INCOME, EXPENSE)
- Delete transactions
- Pull-to-refresh
- Category and date display
- Color-coded amounts (green for income, red for expense)

---

### 5. **Updated Dashboard (HomeScreen)**

**File:** `src/screens/HomeScreen.tsx`

Changes:

- Updated API response parsing to match backend format
- Display income/expense/balance from backend
- Show category breakdown
- View transactions link in footer

---

### 6. **Enhanced Navigation**

**File:** `src/navigation/AppNavigator.tsx`

**Bottom Tab Navigation with 5 tabs:**

1. 📊 **Dashboard** - Financial overview, income/expense summary
2. 📝 **Transactions** - View all expenses, filter, delete
3. 💬 **SMS Parser** - Smart message parsing
4. ➕ **Add** - Quick add expense form
5. 👤 **Profile** - User info, logout

**Nested Stack Navigation:**

- Dashboard Stack (Home + AddExpense modal)
- Transactions Stack
- SMS Stack
- Profile Screen

---

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd my-expo-app
npm install
```

New packages installed:

- `@react-navigation/bottom-tabs` - Tab navigation
- `react-native-gesture-handler` - Touch handling

### 2. Configure Backend URL

**File:** `src/api/api.tsx`

Update the baseURL if needed:

```javascript
const api = axios.create({
  baseURL: "http://localhost:4000", // Change this to your backend URL
  withCredentials: true,
});
```

### 3. Start the App

**Development:**

```bash
npm start
```

**Android:**

```bash
npm run android
```

**iOS:**

```bash
npm run ios
```

---

## 📁 Updated File Structure

```
src/
├── api/
│   └── api.tsx                    # Axios instance with backend URL
├── screens/
│   ├── LoginScreen.tsx            # Auth - Login
│   ├── RegisterScreen.tsx         # Auth - Register
│   ├── HomeScreen.tsx             # Updated: Dashboard with new API format
│   ├── AddExpenseScreen.tsx       # Quick add expense
│   ├── ExpensesScreen.tsx         # NEW: List all transactions
│   ├── SMSInputScreen.tsx         # NEW: SMS parser with AI detection
│   └── ProfileScreen.tsx          # User profile & logout
├── utils/
│   └── smsParser.ts               # NEW: SMS parsing logic
├── context/
│   └── AuthContext.tsx            # Auth state management
├── components/
│   └── Input.tsx                  # Reusable input component
├── navigation/
│   └── AppNavigator.tsx           # Updated: 5-tab navigation
```

---

## 🔄 API Integration Details

### Create Expense/Income Payload

```javascript
{
  title: "Grocery shopping",
  amount: 500,
  type: "EXPENSE",              // or "INCOME"
  category: "Food",
  note: "Weekly groceries",      // Optional
  date: "2025-01-10T10:30:00Z"  // Optional (defaults to now)
}
```

### Response Format

```javascript
{
  id: 1,
  title: "Grocery shopping",
  amount: 500,
  type: "EXPENSE",
  category: "Food",
  note: "Weekly groceries",
  date: "2025-01-10T10:30:00Z",
  userId: 1,
  createdAt: "2025-01-10T10:30:00Z"
}
```

---

## 💡 SMS Parser Examples

### Example 1: Salary Received

```
Input: "Your salary of ₹50000 has been credited to your account"
Output:
{
  type: "INCOME",
  amount: 50000,
  title: "Your salary has been credited to your account",
  category: "Salary",
  confidence: 0.95
}
```

### Example 2: Food Purchase

```
Input: "Paid ₹250 for lunch at restaurant"
Output:
{
  type: "EXPENSE",
  amount: 250,
  title: "Paid for lunch at restaurant",
  category: "Food",
  confidence: 0.92
}
```

### Example 3: Uber Ride

```
Input: "Uber ride of ₹180 completed"
Output:
{
  type: "EXPENSE",
  amount: 180,
  title: "Uber ride completed",
  category: "Transport",
  confidence: 0.88
}
```

---

## 🔐 Authentication Flow

1. **Signup** → Backend returns user object
2. **Login** → Backend returns accessToken + refreshToken
3. **Refresh** → Auto-refreshes token on 401 response
4. **Logout** → Clears tokens and user state

Token storage:

- Access Token: Stored in `api.defaults.headers` + AsyncStorage
- Refresh Token: Stored in Expo SecureStore (encrypted)

---

## ⚠️ Important Notes

### SMS Parser Limitations

- Works best with transaction messages from banks/apps
- Requires explicit amount in message
- Category detection based on keywords (not 100% accurate)
- Confidence score helps validate detections

### Backend Requirements

- Ensure all endpoints are accessible
- CORS must allow requests from Expo app
- Database must have initial user setup
- Refresh token rotation working properly

### Environment Variables

Create `.env` file in my-expo-app root (if needed):

```
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_URL:4000
```

---

## 🐛 Troubleshooting

### Issue: API Connection Failed

- Check backend is running: `npm run dev` in backend folder
- Verify baseURL in `src/api/api.tsx`
- Ensure CORS is enabled in backend

### Issue: SMS Parser Not Detecting

- Message must contain an amount
- Use clear keywords (paid, received, spent, etc.)
- Check confidence score - may be too low

### Issue: Transactions Not Appearing

- Verify token is valid
- Check `/api/expenses` endpoint returns data
- Pull-to-refresh to reload

---

## 📦 Dependencies

```json
{
  "@react-navigation/native": "^7.1.20",
  "@react-navigation/native-stack": "^7.6.3",
  "@react-navigation/bottom-tabs": "^7.0.0",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "axios": "^1.13.2",
  "expo": "^54.0.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "~2.10.0"
}
```

---

## 🎯 Next Steps

1. ✅ Test login/registration flow
2. ✅ Test SMS parser with sample messages
3. ✅ Create and view transactions
4. ✅ Test filtering and deletion
5. ✅ Verify analytics summary

---

## 📞 Support

For issues or questions:

- Check backend logs: `backend/` folder
- Review API endpoint response: Use Postman
- Test SMS parser: Use browser console
