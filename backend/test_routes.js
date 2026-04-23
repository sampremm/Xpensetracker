const baseUrl = "http://localhost:4000/api";
let accessToken = "";
let expenseId = null;

async function testRoutes() {
  console.log("1. Testing Signup");
  let email = `test${Date.now()}@test.com`;
  let res = await fetch(`${baseUrl}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email: email, password: "password123" })
  });
  let data = await res.json();
  console.log("Signup:", res.status, data.user?.email ? "Success" : "Failed");
  if (data.accessToken) accessToken = data.accessToken;

  console.log("\n2. Testing Login");
  res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: "password123" })
  });
  data = await res.json();
  console.log("Login:", res.status, data.user?.email ? "Success" : "Failed");
  if (data.accessToken) accessToken = data.accessToken;

  console.log("\n3. Testing /me");
  res = await fetch(`${baseUrl}/auth/me`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  data = await res.json();
  console.log("Me:", res.status, data.email ? "Success" : "Failed");

  console.log("\n4. Testing Create Expense");
  res = await fetch(`${baseUrl}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
    body: JSON.stringify({ title: "Test Expense", amount: 100, type: "EXPENSE", category: "Food" })
  });
  data = await res.json();
  console.log("Create Expense:", res.status, data.id ? "Success" : "Failed");
  expenseId = data.id;

  console.log("\n5. Testing Get Expenses");
  res = await fetch(`${baseUrl}/expenses`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  data = await res.json();
  console.log("Get Expenses:", res.status, Array.isArray(data) ? `Success (Count: ${data.length})` : "Failed");

  console.log("\n6. Testing Analytics Summary");
  res = await fetch(`${baseUrl}/analytics/summary`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  data = await res.json();
  console.log("Summary:", res.status, data.expense !== undefined ? "Success" : "Failed");

  if (expenseId) {
    console.log("\n7. Testing Delete Expense");
    res = await fetch(`${baseUrl}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    data = await res.json();
    console.log("Delete Expense:", res.status, data.success ? "Success" : "Failed");
  }
}

testRoutes().catch(console.error);
