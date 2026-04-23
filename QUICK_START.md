# Quick Start: SMS Expense Tracking Feature

## Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
npx prisma migrate deploy  # Run migrations (already done ✓)
npm run build              # Compile TypeScript
npm run dev                # Start server (runs on port 3000)
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start                  # Start Expo dev server
```

---

## Testing the Feature

### Method 1: Manual SMS Testing (Recommended for Quick Demo)

1. **Open the app** → Navigate to "Add Expense" or SMS Parser screen
2. **Paste a test SMS message:**
   ```
   SBI Credit Alert: Your Account is credited with INR 5000. Salary transferred.
   ```
3. **Click "Analyze Message"** → You'll see the parsed data:
   - Type: INCOME
   - Amount: ₹5000
   - Category: Salary
   - Confidence: 95%
4. **Click "Save Transaction"** → Transaction saved to database
5. **View in Dashboard** → See it in Expenses/Income list

### Method 2: Bulk SMS Upload Testing

1. **Paste Multiple SMS Messages** (one at a time):

   ```
   Message 1: "HDFC Card payment: You spent Rs. 1200 at McDonald's"
   Message 2: "PayPal: You received ₹2000 from freelance project"
   Message 3: "Google Pay: Sent ₹500 to friend for dinner"
   ```

2. **Click "Load Sample SMS"** (in dev mode)
   - Loads mock SMS messages from the system

3. **Select Transactions**
   - Tap on SMS to toggle selection
   - Watch the counter increase

4. **Click "Upload X Transactions"**
   - Confirm in dialog
   - All transactions sent together
   - See success message

---

## Test SMS Messages

Use these to test different scenarios:

### Income Messages

```
1. SBI Mobile Banking: Your account is credited with INR 5000. Salary monthly.
2. HDFC Bank: Amount of Rs. 2500 has been received in your account.
3. PayPal: You received payment of ₹1500 from client_name.
4. Google Pay: You received ₹3000 from John.
```

### Expense Messages

```
1. Swiggy: Order placed for ₹450. Payment successful.
2. Amazon: Payment received of ₹2000 for your purchase.
3. Uber: Trip charged - INR 150. Thank you for riding.
4. Starbucks: Card debited with ₹350. At Starbucks Coffee.
5. ICICI Debit: You spent INR 500 at Reliance Retail.
```

### Mixed Transactions

```
1. AXIS Bank: Salary credited INR 50000.
2. Swiggy: Order food ₹250.
3. HDFC Credit Card: Paid ₹5000 towards bill.
4. Amazon Pay: Refund of ₹1200 initiated.
5. UPI: Paid ₹100 to friend for movie.
```

---

## API Endpoints Quick Reference

### Health Check

```bash
curl http://localhost:3000/api/expenses
```

### Get All Expenses

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/expenses
```

### Create Single Expense from SMS

```bash
curl -X POST http://localhost:3000/api/expenses/sms/single \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "amount": 5000,
    "title": "Salary",
    "category": "Salary",
    "confidence": 0.95
  }'
```

### Create Bulk Expenses from SMS

```bash
curl -X POST http://localhost:3000/api/expenses/sms/bulk \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "type": "EXPENSE",
      "amount": 500,
      "title": "Food",
      "category": "Food",
      "confidence": 0.88
    },
    {
      "type": "INCOME",
      "amount": 2000,
      "title": "Freelance",
      "category": "Freelance",
      "confidence": 0.92
    }
  ]'
```

---

## Key Features Implemented

✅ **SMS Parsing**

- Automatic amount extraction (₹, INR, Rs, $, etc.)
- Transaction type detection (INCOME/EXPENSE)
- Smart category classification
- Confidence scoring

✅ **Mobile UI**

- Checkboxes for multi-select
- Bulk upload button
- Selection counter
- Transaction preview cards
- Confirmation dialog

✅ **Backend API**

- Single SMS endpoint (`/api/expenses/sms/single`)
- Bulk SMS endpoint (`/api/expenses/sms/bulk`)
- Full authentication & validation
- Error handling

✅ **Database**

- Automatic transaction creation
- User association
- Full audit trail

---

## File Changes Summary

### Created/Modified Files:

1. `backend/src/modules/expenses/expense.routes.ts` ✏️
   - Added SMS endpoints

2. `backend/src/modules/expenses/expense.controller.ts` ✏️
   - Added SMS handlers with validation

3. `backend/src/modules/expenses/expense.service.ts` ✏️
   - Added bulk create function

4. `frontend/src/screens/SMSInputScreen.tsx` ✏️
   - Enhanced with bulk selection UI
   - Added bulk upload function

5. `SMS_AUTOMATION_GUIDE.md` ✨
   - Comprehensive documentation

---

## Debugging

### Enable Verbose Logging

```typescript
// In frontend/src/screens/SMSInputScreen.tsx
console.log("Selected transactions:", selected);
console.log("Payload:", payload);
```

### Check Backend Logs

```bash
# Terminal where backend is running
# Should see POST requests to /api/expenses/sms/bulk
```

### Database Check

```bash
# In backend folder
npx prisma studio
# Browse to http://localhost:5555
# View all expenses created
```

---

## Performance Tips

1. **Limit bulk uploads to 50 transactions** at a time
2. **Use pagination** when viewing many expenses
3. **Index the `userId` column** for faster queries (already done)
4. **Cache categories** on frontend to reduce parsing time

---

## Next Steps (Optional)

1. **Add SMS Duplicate Prevention**
   - Track SMS hashes in database
   - Prevent duplicate uploads

2. **Implement Auto-Delete**
   - Delete old SMS transactions after 30 days

3. **Add Recurring Transactions**
   - Mark as recurring (subscription, salary)
   - Auto-create next month's entry

4. **Export Feature**
   - CSV/PDF export of transactions
   - Monthly reports

5. **Native SMS Integration**
   - Eject from Expo for full SMS access
   - Background service for auto-sync

---

## Troubleshooting Checklist

- [ ] Backend running on port 3000?
- [ ] Frontend connected to correct API URL?
- [ ] JWT token valid and not expired?
- [ ] Database migrations applied?
- [ ] SMS contains amount and keywords?
- [ ] Network connection working?

---

## Support

Check the full guide: [SMS_AUTOMATION_GUIDE.md](./SMS_AUTOMATION_GUIDE.md)

For detailed architecture and examples, see the main documentation.

---

Ready to test! 🚀
