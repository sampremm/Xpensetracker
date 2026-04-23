# SMS Expense Tracking - API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints require JWT bearer token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Single SMS Expense

**Endpoint:** `POST /expenses/sms/single`

**Description:** Creates a single expense/income transaction from parsed SMS data.

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "type": "INCOME",
  "amount": 5000,
  "title": "Salary Transfer",
  "category": "Salary",
  "confidence": 0.95,
  "bank": "SBI",
  "smsBodies": ["SBI Credited INR 5000. Salary processed."],
  "date": "2026-02-08T12:30:00Z"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | enum | Yes | "INCOME" or "EXPENSE" |
| amount | number | Yes | Transaction amount (positive) |
| title | string | Yes | Transaction description (1-255 chars) |
| category | string | Yes | Category name (Food, Transport, etc.) |
| confidence | number | No | Confidence score (0-1) |
| bank | string | No | Bank name if detected |
| smsBodies | array | No | Original SMS text(s) |
| date | string | No | ISO 8601 date (defaults to now) |

**Success Response (201):**

```json
{
  "success": true,
  "expense": {
    "id": 123,
    "title": "Salary Transfer",
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "note": "SBI Credited INR 5000. Salary processed.",
    "date": "2026-02-08T12:30:00Z",
    "userId": 1,
    "createdAt": "2026-02-08T12:35:00Z"
  },
  "confidence": 0.95,
  "bank": "SBI"
}
```

**Error Response (400):**

```json
{
  "error": "Validation failed: amount must be positive"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/expenses/sms/single \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "amount": 5000,
    "title": "Salary",
    "category": "Salary",
    "confidence": 0.95,
    "bank": "SBI",
    "smsBodies": ["SBI Credited INR 5000"]
  }'
```

---

### 2. Create Bulk SMS Expenses

**Endpoint:** `POST /expenses/sms/bulk`

**Description:** Creates multiple expense/income transactions from parsed SMS data in one request.

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
[
  {
    "type": "EXPENSE",
    "amount": 500,
    "title": "Food Purchase",
    "category": "Food",
    "confidence": 0.88,
    "bank": "HDFC",
    "smsBodies": ["HDFC Card: Spent ₹500 at McDonald's"],
    "date": "2026-02-08T10:00:00Z"
  },
  {
    "type": "INCOME",
    "amount": 2000,
    "title": "Freelance Project Payment",
    "category": "Freelance",
    "confidence": 0.92,
    "smsBodies": ["PayPal: Received ₹2000"]
  },
  {
    "type": "EXPENSE",
    "amount": 350,
    "title": "Uber Ride",
    "category": "Transport",
    "confidence": 0.85,
    "bank": "Uber"
  }
]
```

**Field Descriptions:**
Same as single endpoint, but sent as an array. Minimum 1, Maximum 50 transactions recommended.

**Success Response (201):**

```json
{
  "success": true,
  "count": 3,
  "expenses": [
    {
      "id": 124,
      "title": "Food Purchase",
      "amount": 500,
      "type": "EXPENSE",
      "category": "Food",
      "date": "2026-02-08T10:00:00Z",
      "userId": 1,
      "createdAt": "2026-02-08T12:35:10Z"
    },
    {
      "id": 125,
      "title": "Freelance Project Payment",
      "amount": 2000,
      "type": "INCOME",
      "category": "Freelance",
      "date": "2026-02-08T12:35:10Z",
      "userId": 1,
      "createdAt": "2026-02-08T12:35:10Z"
    },
    {
      "id": 126,
      "title": "Uber Ride",
      "amount": 350,
      "type": "EXPENSE",
      "category": "Transport",
      "date": "2026-02-08T12:35:10Z",
      "userId": 1,
      "createdAt": "2026-02-08T12:35:10Z"
    }
  ]
}
```

**Error Response (400) - Partial Failure:**

```json
{
  "error": "Validation failed: Transaction 2 - amount must be positive"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/expenses/sms/bulk \
  -H "Authorization: Bearer eyJhbGc..." \
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

### 3. Get All Expenses (Existing)

**Endpoint:** `GET /expenses`

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
?type=INCOME&start=2026-02-01&end=2026-02-28&category=Salary
```

**Response (200):**

```json
[
  {
    "id": 124,
    "title": "Food Purchase",
    "amount": 500,
    "type": "EXPENSE",
    "category": "Food",
    "note": "HDFC Card: Spent ₹500",
    "date": "2026-02-08T10:00:00Z",
    "userId": 1,
    "createdAt": "2026-02-08T12:35:10Z"
  }
]
```

---

### 4. Get Single Expense (Existing)

**Endpoint:** `GET /expenses/:id`

**Response (200):**

```json
{
  "id": 124,
  "title": "Food Purchase",
  "amount": 500,
  "type": "EXPENSE",
  "category": "Food",
  "date": "2026-02-08T10:00:00Z",
  "userId": 1,
  "createdAt": "2026-02-08T12:35:10Z"
}
```

---

### 5. Delete Expense (Existing)

**Endpoint:** `DELETE /expenses/:id`

**Response (200):**

```json
{
  "success": true
}
```

---

## Data Types

### Expense Object

```typescript
{
  id: number;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  note: string | null; // Original SMS body
  date: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### SMS Parsed Data

```typescript
{
  type: "INCOME" | "EXPENSE";
  amount: number;           // Always positive
  title: string;            // Auto-generated or user-provided
  category: string;         // Detected or provided
  confidence: number;       // 0-1 confidence score
  bank?: string;            // Optional bank name
  smsBodies?: string[];     // Original SMS text
  date?: string;            // ISO 8601 format
}
```

---

## Error Codes

| Code | Error                 | Reason                      | Solution                                  |
| ---- | --------------------- | --------------------------- | ----------------------------------------- |
| 400  | Validation failed     | Invalid input data          | Check field types and values              |
| 401  | Unauthorized          | Missing/invalid token       | Include valid JWT in Authorization header |
| 403  | Forbidden             | Accessing other user's data | Can only access own transactions          |
| 500  | Internal server error | Database or server error    | Check server logs, retry later            |

---

## Rate Limiting

Currently no rate limiting implemented. Recommended: **100 requests per minute per user**

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Single SMS
const response = await fetch("/api/expenses/sms/single", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "INCOME",
    amount: 5000,
    title: "Salary",
    category: "Salary",
    confidence: 0.95,
  }),
});

const data = await response.json();
console.log(`Created expense #${data.expense.id}`);
```

### Python

```python
import requests

url = 'http://localhost:3000/api/expenses/sms/single'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}
payload = {
    'type': 'INCOME',
    'amount': 5000,
    'title': 'Salary',
    'category': 'Salary',
    'confidence': 0.95
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(f"Created expense #{data['expense']['id']}")
```

### cURL (Bulk)

```bash
curl -X POST http://localhost:3000/api/expenses/sms/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @transactions.json
```

File `transactions.json`:

```json
[
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
]
```

---

## Validation Rules

### Amount

- ✅ Must be positive number (> 0)
- ✅ Max 2 decimal places
- ✅ Range: 0.01 to 999,999,999.99

### Title

- ✅ Required
- ✅ Minimum 1 character
- ✅ Maximum 255 characters
- ✅ Trimmed of whitespace

### Category

- ✅ Required
- ✅ Minimum 1 character
- ✅ Maximum 100 characters
- ✅ Examples: Food, Transport, Bills, Entertainment, Health, Salary, Freelance

### Type

- ✅ Must be exactly "INCOME" or "EXPENSE"
- ✅ Case-sensitive

### Date

- ✅ Optional, defaults to current time
- ✅ Must be valid ISO 8601 format
- ✅ Cannot be in the future

---

## Success Criteria

**Single SMS Endpoint:**

- ✅ Returns 201 Created
- ✅ Includes expense object with ID
- ✅ Returns confidence and bank in response

**Bulk SMS Endpoint:**

- ✅ Returns 201 Created
- ✅ Returns count of expenses created
- ✅ Returns array of all created expenses
- ✅ All-or-nothing transaction (if one fails, all fail)

---

## Performance Benchmarks

| Operation   | Time       | Conditions  |
| ----------- | ---------- | ----------- |
| Single SMS  | 50-150ms   | Normal load |
| Bulk 10 SMS | 200-400ms  | Normal load |
| Bulk 50 SMS | 800-1500ms | Normal load |
| Parse SMS   | 10-50ms    | Client-side |

---

## Changelog

### Version 1.0 (Current)

- ✅ Single SMS endpoint
- ✅ Bulk SMS endpoint
- ✅ Full validation
- ✅ Authentication check
- ✅ Confidence scoring
- ✅ Bank detection

### Planned for v1.1

- Duplicate prevention
- SMS tracking table
- Webhook support
- Rate limiting

---

## Support

For API issues:

1. Check request format against examples
2. Verify JWT token is still valid
3. Review error message details
4. Check backend server logs
5. Ensure database is connected

---

Last Updated: February 2026
API Version: 1.0
