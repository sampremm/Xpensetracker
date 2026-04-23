# Troubleshooting Guide

## Issues Fixed

### ✅ Issue 1: API URL Mismatch (FIXED)

**Error:** `POST http://localhost:4000/api/auth/login 400 (Bad Request)`

**Cause:** Frontend was trying to connect to port 4000, but backend runs on port 3000

**Solution:** ✓ Updated `frontend/src/api/api.tsx` to use `http://localhost:3000`

---

### ✅ Issue 2: Navigation Error (FIXED)

**Error:** `The action 'REPLACE' with payload {"name":"Home"} was not handled by any navigator.`

**Cause:** LoginScreen tried to navigate to 'Home' screen after login, but 'Home' is nested inside a stack - doesn't exist at top level

**Solution:** ✓ Removed manual navigation in:

- `frontend/src/screens/LoginScreen.tsx`
- `frontend/src/screens/RegisterScreen.tsx`

Now navigation is automatic: when user state updates in AuthContext, AppNavigator automatically switches to authenticated screens.

---

### ✅ Issue 3: 401 Unauthorized (Will be fixed after login)

**Error:** `GET http://localhost:4000/api/auth/me 401 (Unauthorized)`

**Cause:** App tried to check auth status but no token was stored (expected on first run)

**Solution:** ✓ After successful login, token is automatically stored and used for all API calls

---

## Setup Instructions

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

✓ Should start on `http://localhost:3000`

### 2. Start Frontend App

```bash
cd frontend
npm start
```

✓ Web: Press `w` then open browser to shown URL
✓ Or use: `npx expo start --web`

### 3. Test Login

Use these credentials to test:

```
Email: test@example.com  (or any email you registered)
Password: password123 (or your chosen password)
```

Or register a new account first.

---

## Common Issues & Solutions

### Problem: App stuck on loading screen

**Solution:**

1. Check that backend is running on port 3000
2. Check browser console for errors
3. Make sure `.env` file in backend has `DATABASE_URL` set correctly
4. Restart both frontend and backend

### Problem: Login gives "400 Bad Request"

**Solution:**

1. Check backend is running: `curl http://localhost:3000/api/auth/login`
2. Verify database is running and migrations applied
3. Check `.env` file has all required variables
4. Try with correct credentials

### Problem: App keeps redirecting to login

**Solution:**

1. Check that token is being saved - look in browser Storage
2. Verify backend `/api/auth/me` endpoint works
3. Make sure backend can query the database
4. Check `AuthContext.tsx` bootstrap process in browser console

### Problem: Blank white screen after login

**Solution:**

1. Check browser console for errors
2. Verify `HomeScreen.tsx` and other screens are working
3. Hard refresh the browser
4. Clear browser cache and reload

### Problem: API calls return 401 even with token

**Solution:**

1. Check token expiration - might need refresh
2. Verify `Authorization` header is being sent
3. Check backend `verifyToken` middleware
4. Look at token format - should be `Bearer <token>`

---

## Debugging Tips

### Check Backend Logs

```bash
# Terminal running backend (npm run dev should show logs)
# Look for:
# - Connection messages
# - Auth errors
# - Database errors
```

### Check Frontend Logs

```bash
# Browser Console (F12 or Cmd+Option+I)
# Look for:
# - Network errors (red X's)
# - JavaScript errors
# - API response details
```

### Test API Manually

```bash
# Test without auth
curl http://localhost:3000/api/expenses

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Response should include: user, accessToken, refreshToken
```

### Check Database

```bash
cd backend
npx prisma studio
# Opens UI at http://localhost:5555
# Can browse all data and run queries
```

---

## Files Modified

✅ `frontend/src/api/api.tsx` - API URL fixed to port 3000
✅ `frontend/src/screens/LoginScreen.tsx` - Removed manual navigation
✅ `frontend/src/screens/RegisterScreen.tsx` - Removed manual navigation

---

## Next Steps

1. **Verify Setup:**

   ```bash
   # 1. Backend running?
   curl http://localhost:3000/api/health

   # 2. Database connected?
   cd backend && npx prisma studio

   # 3. Can login?
   # Try logging in through frontend
   ```

2. **Test SMS Feature:**
   - After login, go to SMS Parser tab
   - Paste test SMS message
   - Click "Analyze Message"
   - Try bulk upload feature

3. **Check Logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal where `npm run dev` is running

---

## Emergency Reset

If everything is broken:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Clear frontend cache
cd frontend
rm -rf .expo
npm start  # This regenerates cache

# 3. Reset database
cd backend
npx prisma migrate reset

# 4. Start fresh
npm run dev  # In backend
npm start    # In frontend
```

---

## Support

If issues persist:

1. Check all three files mentioned above are fixed
2. Verify backend runs on 3000: `curl http://localhost:3000`
3. Verify frontend connects: Check browser console
4. Check database is up: `npx prisma studio`
5. Try emergency reset above

---

**Last Updated:** February 8, 2026  
**Issues Fixed:** 3 (API URL, Navigation Auto-redirect, Auth Flow)  
**Status:** ✅ Ready for testing
