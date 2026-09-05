# Urban Furniture — API Contract Documentation
**Owner:** Student 1 — Backend Implementation  
**Intended Audience:** Student 2 (React Frontend Functionality), Student 3 (UI/UX Design), Student 4 (QA & Integration)  
**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication & Security

All protected endpoints require a JWT token passed in the `Authorization` header:
```http
Authorization: Bearer <jwt_token>
```

### Roles & Access Control
- **`admin`**: Full CRUD access across the entire system. Can create, edit, and delete receipts, users, accounts, journals, orders, and bills.
- **`accountant`**: Financial and transaction management. Can create and confirm orders, **process/confirm Goods Received and Sales Receipts**, post journal entries, register payments, and view all reports.
- **`contact`**: Restricted portal access for customer/vendor self-service.

---

## 2. Standard Response & Error Format

### Success Response Format:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... }
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Descriptive error message indicating the failure reason",
  "error": "Optional internal details in development mode"
}
```

---

## 3. Health & Heartbeat APIs (Admin Dashboard)

### Standard Health Check
- **Endpoint:** `GET /api/health`
- **Auth:** Public
- **Response:**
```json
{
  "success": true,
  "status": "UP",
  "message": "Urban Furniture Accounting API is running smoothly",
  "timestamp": "2026-09-05T10:00:00.000Z"
}
```

### Admin Live Heartbeat Monitor
- **Endpoint:** `GET /api/health/heartbeat`
- **Auth:** Public / Admin Dashboard widget
- **Response:**
```json
{
  "success": true,
  "heartbeat": {
    "status": "ALIVE",
    "timestamp": "2026-09-05T10:00:00.000Z",
    "uptimeSeconds": 1420,
    "uptimeFormatted": "0h 23m 40s",
    "database": {
      "status": "Connected",
      "connected": true,
      "host": "127.0.0.1",
      "name": "urban_furniture_db"
    },
    "memoryUsageMB": {
      "rss": "79.09",
      "heapTotal": "37.37",
      "heapUsed": "21.11"
    },
    "system": {
      "nodeVersion": "v24.11.1",
      "platform": "win32",
      "pid": 22428
    }
  }
}
```

---

## 4. Authentication Endpoints

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Body:**
```json
{
  "name": "Alex Smith",
  "email": "alex@urbanfurniture.com",
  "password": "SecurePassword123!",
  "role": "accountant"
}
```
- **Response (201):** Returns JWT `token` and `user` object.

### Login User
- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "admin@urbanfurniture.com",
  "password": "AdminPassword123!"
}
```
- **Response (200):** Returns JWT `token` and `user` object.

### Get Current Profile
- **Endpoint:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** Current authenticated user data.

---

## 5. Master Data Endpoints

### Contacts (`/api/contacts`)
- `GET /api/contacts?type=Customer|Vendor|Both&search=xyz`
- `GET /api/contacts/:id`
- `POST /api/contacts` (Admin, Accountant)
  ```json
  {
    "name": "Nimesh Pathak",
    "type": "Customer",
    "email": "nimesh@example.com",
    "mobile": "9876543210",
    "address": { "city": "Ahmedabad", "state": "Gujarat", "pincode": "380015" }
  }
  ```
- `PUT /api/contacts/:id` (Admin, Accountant)
- `DELETE /api/contacts/:id` (Admin)

### Products (`/api/products`)
- `GET /api/products?type=Goods|Service|Combo&category=...`
- `GET /api/products/:id`
- `POST /api/products` (Admin, Accountant)
  ```json
  {
    "name": "Office Chair",
    "type": "Goods",
    "salesPrice": 2500,
    "costPrice": 1500,
    "category": "Office Furniture",
    "taxPercent": 0
  }
  ```
- `PUT /api/products/:id` (Admin, Accountant)
- `DELETE /api/products/:id` (Admin)

### Chart of Accounts (`/api/accounts`)
- `GET /api/accounts?type=Asset|Liability|Expense|Income|Capital`
- `POST /api/accounts` (Admin, Accountant)
  ```json
  {
    "code": "1001",
    "name": "Cash",
    "type": "Asset",
    "description": "Cash in Hand"
  }
  ```
- `PUT /api/accounts/:id`
- `DELETE /api/accounts/:id` (Admin; system accounts protected)

### Journals (`/api/journals`)
- `GET /api/journals`
- `POST /api/journals` (Admin, Accountant)
  ```json
  {
    "code": "INV",
    "name": "Sales Journal",
    "type": "Sales",
    "defaultDebitAccount": "<Debtors_Id>",
    "defaultCreditAccount": "<SaleIncome_Id>"
  }
  ```

### Analytic Accounts (`/api/analytic-accounts`)
- `GET /api/analytic-accounts`
- `POST /api/analytic-accounts` (Admin, Accountant)
  ```json
  {
    "code": "AN-OPS",
    "name": "Operations Expense",
    "type": "Expenses"
  }
  ```

### Budgets (`/api/budgets`)
- `GET /api/budgets?period=2026-Annual`
- `POST /api/budgets` (Admin, Accountant)
  ```json
  {
    "name": "Annual Operations Budget 2026",
    "period": "2026-Annual",
    "analyticAccount": "<AnalyticAccount_Id>",
    "plannedAmount": 500000,
    "responsiblePerson": "Admin"
  }
  ```

---

## 6. Accounting Engine & Journal Entries

### Journal Entries (`/api/journal-entries`)
- `GET /api/journal-entries?journal=...&status=draft|posted`
- `POST /api/journal-entries` (Admin, Accountant)
  ```json
  {
    "journal": "<Journal_Id>",
    "date": "2026-09-05",
    "reference": "JE/2026/001",
    "items": [
      { "account": "<Debit_Account_Id>", "debit": 5000, "credit": 0, "label": "Office supplies" },
      { "account": "<Credit_Account_Id>", "debit": 0, "credit": 5000, "label": "Cash payment" }
    ]
  }
  ```
- `POST /api/journal-entries/:id/post`
  - Validates Total Debit == Total Credit.
  - Rejects unbalanced entries with HTTP 400.
  - Updates account balances in real-time.
- `POST /api/journal-entries/:id/cancel`
  - Reverses posted ledger impacts.

---

## 7. Purchase Flow & Goods Receipts

### Purchase Orders (`/api/purchase-orders`)
- `GET /api/purchase-orders`
- `POST /api/purchase-orders` (Admin, Accountant)
  ```json
  {
    "vendor": "<Vendor_Contact_Id>",
    "items": [
      { "product": "<Product_Id>", "quantity": 5, "unitPrice": 1500 }
    ]
  }
  ```
- `POST /api/purchase-orders/:id/confirm`

### Goods Receipts (`/api/goods-receipts`)
- **Permissions:** Admin has full CRUD (add, update, delete). **Both Admin and Accountant can confirm/process receipts**.
- **Validations Enforced:** Number validation (receiptNumber format & positive quantities), Date validation (valid date), and Total Price validation (`totalPrice = qty * unitPrice`, `totalAmount = sum(totalPrice)`).
- `GET /api/goods-receipts`
- `POST /api/goods-receipts` (Admin only)
  ```json
  {
    "receiptNumber": "GR/2026/0001",
    "purchaseOrder": "<PurchaseOrder_Id>",
    "vendor": "<Vendor_Id>",
    "receiptDate": "2026-09-05",
    "items": [
      { "product": "<Product_Id>", "quantity": 5, "unitPrice": 1500 }
    ]
  }
  ```
- `POST /api/goods-receipts/:id/confirm` (Admin and Accountant)

### Vendor Bills (`/api/vendor-bills`)
- `POST /api/vendor-bills` (Admin, Accountant)
- `POST /api/vendor-bills/:id/post`
  - Automatically posts balanced double-entry:
    - **Debit:** Purchases Expense
    - **Credit:** Creditors (Accounts Payable)

---

## 8. Sales Flow & Sales Receipts

### Sales Orders (`/api/sales-orders`)
- `GET /api/sales-orders`
- `POST /api/sales-orders` (Admin, Accountant)
  ```json
  {
    "customer": "<Customer_Contact_Id>",
    "items": [
      { "product": "<Product_Id>", "quantity": 5, "unitPrice": 2500, "taxPercent": 0 }
    ]
  }
  ```
- `POST /api/sales-orders/:id/confirm`

### Sales Receipts (`/api/sales-receipts`)
- **Permissions:** Admin has full CRUD. **Both Admin and Accountant can confirm/process sales receipts**.
- **Validations Enforced:** Number validation, Date validation, and Total Price validation.
- `GET /api/sales-receipts`
- `POST /api/sales-receipts` (Admin only)
  ```json
  {
    "receiptNumber": "SR/2026/0001",
    "salesOrder": "<SalesOrder_Id>",
    "customer": "<Customer_Id>",
    "receiptDate": "2026-09-05",
    "items": [
      { "product": "<Product_Id>", "quantity": 5, "unitPrice": 2500 }
    ]
  }
  ```
- `POST /api/sales-receipts/:id/confirm` (Admin and Accountant)

### Customer Invoices (`/api/customer-invoices`)
- `POST /api/customer-invoices` (Admin, Accountant)
- `POST /api/customer-invoices/:id/post`
  - Automatically posts balanced double-entry:
    - **Debit:** Debtors (Accounts Receivable)
    - **Credit:** Sale Income
    - **Credit:** Tax Payable (if applicable)

---

## 9. Payments (`/api/payments`)

### Register Vendor Bill Payment:
```http
POST /api/payments
```
```json
{
  "paymentType": "send_money",
  "partner": "<Vendor_Id>",
  "amount": 7500,
  "paymentMethod": "Bank",
  "vendorBill": "<VendorBill_Id>",
  "notes": "Bank transfer payment for Azure Furniture bill"
}
```
**Accounting impact:** Debit Creditors, Credit Bank; sets Bill status to `paid` or `partial`.

### Register Customer Invoice Payment:
```http
POST /api/payments
```
```json
{
  "paymentType": "receive_money",
  "partner": "<Customer_Id>",
  "amount": 12500,
  "paymentMethod": "Bank",
  "customerInvoice": "<CustomerInvoice_Id>",
  "notes": "Payment received from Nimesh Pathak"
}
```
**Accounting impact:** Debit Bank, Credit Debtors; sets Invoice status to `paid` or `partial`.

---

## 10. Financial Report APIs (`/api/reports`)

### Profit & Loss Report
- **Endpoint:** `GET /api/reports/profit-loss`
- **Output:**
```json
{
  "success": true,
  "report": {
    "income": {
      "total": 12500,
      "accounts": [ { "code": "4001", "name": "Sale Income", "balance": 12500 } ]
    },
    "expenses": {
      "purchasesExpense": 7500,
      "otherExpenses": 0,
      "total": 7500,
      "accounts": [ { "code": "5001", "name": "Purchases Expense", "balance": 7500 } ]
    },
    "summary": {
      "grossProfit": 5000,
      "netProfit": 5000,
      "isProfitable": true
    }
  }
}
```

### Balance Sheet Report
- **Endpoint:** `GET /api/reports/balance-sheet`
- **Output:**
```json
{
  "success": true,
  "report": {
    "assets": {
      "total": 5000,
      "accounts": [ { "code": "1002", "name": "Bank", "balance": 5000 } ]
    },
    "liabilities": {
      "total": 0,
      "accounts": []
    },
    "equity": {
      "totalCapital": 0,
      "currentNetProfit": 5000,
      "totalEquity": 5000,
      "accounts": []
    },
    "summary": {
      "totalAssets": 5000,
      "totalLiabilitiesAndEquity": 5000,
      "isBalanced": true
    }
  }
}
```

### Budget Report
- **Endpoint:** `GET /api/reports/budget`
- **Output:** Compares planned amounts against actuals by Analytic Account with calculated variance and utilization percentages.
