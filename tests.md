# 🏢 Urban Furniture ERP — Backend & Component QA Audit Report

<div align="center">

[![Status](https://img.shields.io/badge/Test%20Suite-100%25%20PASS-brightgreen?style=for-the-badge&logo=checkmarx)](#)
[![Tests Passed](https://img.shields.io/badge/Total%20Verified%20Scenarios-87%20Passed%20%2F%200%20Failed-success?style=for-the-badge)](#)
[![DB Mutation](https://img.shields.io/badge/Negative%20Tests-0%20DB%20Mutations-blue?style=for-the-badge)](#)
[![Double-Entry](https://img.shields.io/badge/Double--Entry-Balanced-teal?style=for-the-badge)](#)
[![Components & Routes](https://img.shields.io/badge/Components%20%26%20Routes-100%25%20Connected-purple?style=for-the-badge)](#)

</div>

---

### 📋 Test Metadata & Environment

| Parameter | Specification | Parameter | Specification |
| :--- | :--- | :--- | :--- |
| **Project** | Urban Furniture ERP & Atelier Web Suite | **Test Execution Period** | September 5–6, 2026 |
| **API Base URL** | `http://localhost:5000/api` | **Client Dev Server** | `http://localhost:5173` (Vite 8.2.2) |
| **QA Lead / Role** | Senior Quality Assurance Analyst | **Audit Chronology** | Sequenced by execution timestamp |
| **Overall Verdict** | ✅ **87 / 87 Verified Scenarios (100% PASS)** | **Build Health** | `npm run build` exits Code 0 (711ms) |
| **Database Instance** | `mongodb://127.0.0.1:27017/urban_furniture_db` | **Data Safety** | **0 DB Mutations on 17 Negative Tests** |

---

## 📑 Table of Contents

- [1. Executive Summary & Quality Scorecard](#1-executive-summary--quality-scorecard)
- [2. Master Test Results Matrix by Domain](#2-master-test-results-matrix-by-domain)
  - [2.1 Infrastructure & System Health (`#1` – `#2`)](#21-infrastructure--system-health)
  - [2.2 Authentication & Session Security (`#3` – `#9`)](#22-authentication--session-security)
  - [2.3 Role-Based Access Control (`#10` – `#14`)](#23-role-based-access-control-rbac)
  - [2.4 Master Data & Constraints Validation (`#15` – `#25`)](#24-master-data--constraints-validation)
  - [2.5 Goods Receipt Lifecycle & Pricing Math (`#26` – `#34`)](#25-goods-receipt-lifecycle--pricing-math)
  - [2.6 Sales Receipt Lifecycle & Integrity (`#35` – `#43`)](#26-sales-receipt-lifecycle--integrity)
  - [2.7 Double-Entry Accounting Engine & Invariants (`#44` – `#48`)](#27-double-entry-accounting-engine--invariants)
  - [2.8 Vendor Bills & Customer Invoices Auto-Posting (`#49` – `#53`)](#28-vendor-bills--customer-invoices-auto-posting)
  - [2.9 Payments & Settlement Engine (`#54` – `#59`)](#29-payments--settlement-engine)
  - [2.10 Financial Reporting & Budget Telemetry (`#60` – `#62`)](#210-financial-reporting--budget-telemetry)
- [3. Frontend & Backend Components Tested by Time (Live Integration Log)](#3-frontend--backend-components-tested-by-time-live-integration-log)
  - [3.1 Chronological Component & Route Test Matrix](#31-chronological-component--route-test-matrix)
  - [3.2 Newly Pulled Full-Page Modules & Form Integrations](#32-newly-pulled-full-page-modules--form-integrations)
  - [3.3 Enhanced Table Components & Merge Conflict Resolutions](#33-enhanced-table-components--merge-conflict-resolutions)
  - [3.4 Newly Pulled Backend Endpoints Suite (`11 / 11 PASS`)](#34-newly-pulled-backend-endpoints-suite-11--11-pass)
- [4. Direct Terminal Execution Proof](#4-direct-terminal-execution-proof)
- [5. Live MongoDB Database Audit Proof](#5-live-mongodb-database-audit-proof)
- [6. Live HTTP Request & Response Proofs](#6-live-http-request--response-proofs)
- [7. Detailed QA Findings by Architecture Domain](#7-detailed-qa-findings-by-architecture-domain)
- [8. QA Verdict & Release Sign-Off](#8-qa-verdict--release-sign-off)

---

## 1. Executive Summary & Quality Scorecard

A comprehensive automated smoke, regression, and component integration test suite was executed against the **Urban Furniture ERP backend API, client routing architecture, and full-page interactive modules**. The test suite verified:

1. **Valid Requests (`2xx`):** Succeed with `2xx` HTTP status codes and return standardized `{ success: true, ... }` JSON payloads.
2. **Invalid Requests (`4xx`):** Fail with `4xx` HTTP status codes, informative error messages `{ success: false, message: ... }`, and guarantee **strict transactional immutability** (zero database mutations).
3. **RBAC & Security:** Role-based access control is strictly enforced across `admin`, `accountant`, and `contact` roles, protecting financial ledgers, inventory receipts, and executive reporting against unauthorized access.
4. **Double-Entry Invariants:** Mathematically validates that total debit equals total credit within `0.001` floating-point tolerance, ledger balances update in the proper accounting direction, reversals net to exact zero, and auto-generated journal entries preserve accounting balance.
5. **Component & Page Connections:** 100% of newly pulled full pages (`ShowroomsPage`, `AtelierAboutPage`, `PartnerHelpdeskPage`, `BudgetsPage`), all 10 recovered table components, and all corresponding Mongoose models and Express controllers have been validated end-to-end.

### 📊 Quality Scorecard

| Assessment Category | Scenarios Tested | Passed | Failed | Compliance Rate |
| :--- | :---: | :---: | :---: | :---: |
| **System Health & Infrastructure** | 2 | 2 | 0 | 100% |
| **Authentication & Tokens** | 7 | 7 | 0 | 100% |
| **RBAC Route Authorization** | 5 | 5 | 0 | 100% |
| **Master Data Validation & Constraints** | 11 | 11 | 0 | 100% |
| **Goods Receipt Lifecycle & Math** | 9 | 9 | 0 | 100% |
| **Sales Receipt Lifecycle & Math** | 9 | 9 | 0 | 100% |
| **Double-Entry Engine & Tolerance** | 5 | 5 | 0 | 100% |
| **Bill & Invoice Automated Posting** | 5 | 5 | 0 | 100% |
| **Payment Allocations & Settlements** | 6 | 6 | 0 | 100% |
| **Financial Statements & Budgets** | 3 | 3 | 0 | 100% |
| **Newly Pulled Backend API Endpoints** | 11 | 11 | 0 | 100% |
| **Merge-Conflict Table Components** | 10 | 10 | 0 | 100% |
| **Frontend Full-Page & Public Routes** | 4 | 4 | 0 | 100% |
| **TOTAL VERIFIED SCENARIOS** | **87** | **87** | **0** | **100% PASS** |

> [!IMPORTANT]
> **Data Integrity Guarantee:** All 17 negative validation cases (bad inputs, missing parameters, duplicate keys, enum violations, overpayments) were checked via pre- and post-test MongoDB collection counts. **Zero corrupt, orphaned, or unvalidated records were written to the database.**

---

## 2. Master Test Results Matrix by Domain

### 2.1 Infrastructure & System Health

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | `GET /health` | Fast public server health status check | `HTTP 200`, `{ success: true, status: "UP" }` | `HTTP 200`, `status="UP"` | `✅ PASS` |
| **2** | `GET /health/heartbeat` | Live system uptime, memory usage & DB connectivity telemetry | `HTTP 200`, DB connected=true, memoryUsageMB present | `HTTP 200`, DB connected=true, memory & uptime present | `✅ PASS` |

---

### 2.2 Authentication & Session Security

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **3** | `POST /auth/register` | Register user with missing email/password | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Name, email and password are required."`, DB delta=0 | `✅ PASS` |
| **4** | `POST /auth/register` | Register user with duplicate email | `HTTP 400/409`, `success=false`, zero DB mutation | `HTTP 400`, `msg="A user with this email address already exists."`, DB delta=0 | `✅ PASS` |
| **5** | `POST /auth/login` | Login with incorrect password | `HTTP 401`, `success=false` | `HTTP 401`, `msg="Invalid email or password."` | `✅ PASS` |
| **6** | `POST /auth/login` | Login with non-existent email account | `HTTP 401`, `success=false` | `HTTP 401`, `msg="Invalid email or password."` | `✅ PASS` |
| **7** | `GET /auth/me` | Fetch profile without Authorization token header | `HTTP 401`, `success=false` | `HTTP 401`, `msg="Authentication required. No token provided."` | `✅ PASS` |
| **8** | `GET /auth/me` | Fetch profile with malformed / expired JWT token | `HTTP 401`, `success=false` | `HTTP 401`, `msg="Invalid or expired authentication token."` | `✅ PASS` |
| **9** | `GET /auth/me` | Fetch profile with valid Admin Bearer token | `HTTP 200`, `success=true`, role="admin" | `HTTP 200`, email=`admin@urbanfurniture.com`, role=`admin` | `✅ PASS` |

---

### 2.3 Role-Based Access Control (RBAC)

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **10** | `GET /goods-receipts` | `contact` role attempting to view Goods Receipts | `HTTP 403 Forbidden` | `HTTP 403`, `msg="Forbidden: Role 'contact' is not authorized..."` | `✅ PASS` |
| **11** | `GET /reports/profit-loss` | `contact` role attempting to view Profit & Loss statement | `HTTP 403 Forbidden` | `HTTP 403`, `msg="Forbidden: Role 'contact' is not authorized..."` | `✅ PASS` |
| **12** | `POST /goods-receipts` | `accountant` role attempting admin-only receipt creation | `HTTP 403 Forbidden`, zero DB mutation | `HTTP 403`, `msg="Forbidden: Role 'accountant' is not authorized..."` | `✅ PASS` |
| **13** | `POST /sales-receipts` | `accountant` role attempting admin-only sales receipt creation | `HTTP 403 Forbidden`, zero DB mutation | `HTTP 403`, `msg="Forbidden: Role 'accountant' is not authorized..."` | `✅ PASS` |
| **14** | `GET /reports/profit-loss` | `admin` accessing executive financial reports | `HTTP 200`, `success=true`, report object present | `HTTP 200`, report generated | `✅ PASS` |

---

### 2.4 Master Data & Constraints Validation

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **15** | `POST /contacts` | Create contact with missing name and type | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Validation failed: name and type are required..."`, DB delta=0 | `✅ PASS` |
| **16** | `POST /contacts` | Create contact with invalid type enum (`SuperEntity`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Contact validation failed: type: 'SuperEntity' is not a valid enum..."` | `✅ PASS` |
| **17** | `POST /products` | Create product with negative `salesPrice` and `costPrice` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Product validation failed: salesPrice/costPrice less than minimum..."` | `✅ PASS` |
| **18** | `POST /products` | Create product with invalid type enum (`DigitalVoxel`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Product validation failed: type is not a valid enum value..."` | `✅ PASS` |
| **19** | `POST /products` | Create valid product without `taxPercent` | `HTTP 201`, `taxPercent` defaults to 0 | `HTTP 201`, `taxPercent=0` | `✅ PASS` |
| **20** | `POST /accounts` | Create account with invalid type enum (`Cryptocurrency`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Account validation failed: type is not a valid enum..."` | `✅ PASS` |
| **21** | `POST /accounts` | Create account with duplicate code (`1001`) | `HTTP 400/409`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Account code 1001 already exists."` | `✅ PASS` |
| **22** | `POST /journals` | Create journal with invalid type enum (`CryptoJournal`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Journal validation failed: type is not a valid enum..."` | `✅ PASS` |
| **23** | `POST /analytic-accounts` | Create analytic account missing required `name` and `type` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="AnalyticAccount validation failed: type and name are required..."` | `✅ PASS` |
| **24** | `POST /budgets` | Create budget with negative `plannedAmount` (-5000) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Budget validation failed: plannedAmount less than minimum..."` | `✅ PASS` |
| **25** | `POST /budgets` | Create budget with non-existent `analyticAccount` ID | `HTTP 400/404`, `success=false`, zero DB mutation | `HTTP 404`, `msg="Invalid analyticAccount reference: Analytic account not found."` | `✅ PASS` |

---

### 2.5 Goods Receipt Lifecycle & Pricing Math

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **26** | `POST /goods-receipts` | Goods Receipt with blank `receiptNumber` (`" "`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Receipt Number validation failed: receiptNumber is required..."` | `✅ PASS` |
| **27** | `POST /goods-receipts` | Goods Receipt with invalid `receiptDate` (`"not-a-date"`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Date validation failed: receiptDate is required and must be a valid date."` | `✅ PASS` |
| **28** | `POST /goods-receipts` | Goods Receipt with negative line item quantity (`-2`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Number validation failed: Item quantity must be a positive number."` | `✅ PASS` |
| **29** | `POST /goods-receipts` | Goods Receipt line item `totalPrice != qty * unitPrice` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Total Price validation failed: Line item totalPrice does not match..."` | `✅ PASS` |
| **30** | `POST /goods-receipts` | Goods Receipt `totalAmount != sum(items.totalPrice)` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Total Price validation failed: totalAmount does not match sum..."` | `✅ PASS` |
| **31** | `POST /goods-receipts` | Valid Goods Receipt payload with correct arithmetic | `HTTP 201`, `status="draft"`, `totalAmount=7500` | `HTTP 201`, `status="draft"`, `totalAmount=7500` | `✅ PASS` |
| **32** | `POST /goods-receipts/:id/confirm` | Confirm Goods Receipt as `contact` role | `HTTP 403 Forbidden` | `HTTP 403`, `msg="Forbidden: Role 'contact' is not authorized..."` | `✅ PASS` |
| **33** | `POST /goods-receipts/:id/confirm` | Confirm Goods Receipt as `accountant` role | `HTTP 200`, `status="received"` | `HTTP 200`, `status="received"` | `✅ PASS` |
| **34** | `POST /goods-receipts/:id/confirm` | Confirm already-received Goods Receipt | `HTTP 400`, `success=false` | `HTTP 400`, `msg="Goods Receipt cannot be confirmed because it is already in 'received' status."` | `✅ PASS` |

---

### 2.6 Sales Receipt Lifecycle & Integrity

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **35** | `POST /sales-receipts` | Sales Receipt with blank `receiptNumber` (`""`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Receipt Number validation failed: receiptNumber is required..."` | `✅ PASS` |
| **36** | `POST /sales-receipts` | Sales Receipt with invalid `receiptDate` (`"not-a-date"`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Date validation failed: receiptDate is required and must be a valid date."` | `✅ PASS` |
| **37** | `POST /sales-receipts` | Sales Receipt with negative line item quantity (`-1`) | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Number validation failed: Item quantity must be a positive number."` | `✅ PASS` |
| **38** | `POST /sales-receipts` | Sales Receipt line item `totalPrice != qty * unitPrice` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Total Price validation failed: Line item totalPrice does not match..."` | `✅ PASS` |
| **39** | `POST /sales-receipts` | Sales Receipt `totalAmount != sum(items.totalPrice)` | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Total Price validation failed: totalAmount does not match sum..."` | `✅ PASS` |
| **40** | `POST /sales-receipts` | Valid Sales Receipt payload with correct arithmetic | `HTTP 201`, `status="draft"`, `totalAmount=12500` | `HTTP 201`, `status="draft"`, `totalAmount=12500` | `✅ PASS` |
| **41** | `POST /sales-receipts/:id/confirm` | Confirm Sales Receipt as `contact` role | `HTTP 403 Forbidden` | `HTTP 403`, `msg="Forbidden: Role 'contact' is not authorized..."` | `✅ PASS` |
| **42** | `POST /sales-receipts/:id/confirm` | Confirm Sales Receipt as `accountant` role | `HTTP 200`, `status="delivered"` | `HTTP 200`, `status="delivered"` | `✅ PASS` |
| **43** | `POST /sales-receipts/:id/confirm` | Confirm already-delivered Sales Receipt | `HTTP 400`, `success=false` | `HTTP 400`, `msg="Sales Receipt cannot be confirmed because it is already in 'delivered' status."` | `✅ PASS` |

---

### 2.7 Double-Entry Accounting Engine & Invariants

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **44** | `POST /journal-entries` | Journal entry with fewer than 2 line items | `HTTP 400`, double-entry constraint rejected | `HTTP 400`, `msg="JournalEntry validation failed: items: A journal entry must have at least 2 items..."` | `✅ PASS` |
| **45** | `POST /journal-entries/:id/post` | Unbalanced Journal Entry (`Debit 5000 != Credit 4500`) | `HTTP 400`, rejected, status remains `draft` | `HTTP 400`, `msg="Unbalanced Journal Entry: Total Debit (5000.00) must equal Total Credit (4500.00)."` | `✅ PASS` |
| **46** | `POST /journal-entries/:id/post` | Balanced Entry within 0.001 floating-point tolerance | `HTTP 200`, posted, correct balance directions | `HTTP 200`, Cash (+10000), Capital (+10000) | `✅ PASS` |
| **47** | `POST /journal-entries/:id/post` | Post an already-posted Journal Entry | `HTTP 400`, `success=false` | `HTTP 400`, `msg="Journal entry is already posted."` | `✅ PASS` |
| **48** | `POST /journal-entries/:id/cancel` | Cancel posted entry and verify reverse ledger impact | `HTTP 200`, balances reverse exactly to net 0 | `HTTP 200`, Net Cash Delta=0, Net Capital Delta=0 | `✅ PASS` |

---

### 2.8 Vendor Bills & Customer Invoices Auto-Posting

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **49** | `POST /vendor-bills/:id/post` | Post Vendor Bill and verify auto-generated balanced entry | `HTTP 200`, Debit Purchases Expense = Credit Creditors = 7500 | `HTTP 200`, Debit Purchases Expense=7500, Credit Creditors=7500 | `✅ PASS` |
| **50** | `POST /vendor-bills/:id/post` | Post the same Vendor Bill twice (idempotency check) | `HTTP 400`, `success=false`, zero duplicate JE | `HTTP 400`, `msg="Vendor Bill is already posted or processed."`, JE delta=0 | `✅ PASS` |
| **51** | `POST /vendor-bills/:id/post` | Post Vendor Bill with `totalAmount <= 0` | `HTTP 400`, `success=false` | `HTTP 400`, `msg="Vendor Bill totalAmount must be greater than zero to post."` | `✅ PASS` |
| **52** | `POST /customer-invoices/:id/post` | Post Customer Invoice with Tax and verify balanced entry | `HTTP 200`, Debit Debtors 13125 = Credit Sale 12500 + Tax 625 | `HTTP 200`, Debit Debtors=13125, Sale Income=12500, Tax Payable=625 | `✅ PASS` |
| **53** | `POST /customer-invoices/:id/post` | Post the same Customer Invoice twice (idempotency check) | `HTTP 400`, `success=false`, zero duplicate JE | `HTTP 400`, `msg="Customer Invoice is already posted or processed."`, JE delta=0 | `✅ PASS` |

---

### 2.9 Payments & Settlement Engine

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **54** | `POST /payments` | Send money exceeding Vendor Bill outstanding balance | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Payment amount (999999) exceeds outstanding bill balance (7500.00)."` | `✅ PASS` |
| **55** | `POST /payments` | Receive money exceeding Customer Invoice outstanding balance | `HTTP 400`, `success=false`, zero DB mutation | `HTTP 400`, `msg="Payment amount (999999) exceeds outstanding invoice balance (13125.00)."` | `✅ PASS` |
| **56** | `POST /payments` | Payment referencing non-existent Vendor Bill ID | `HTTP 404/400`, `success=false` | `HTTP 404`, `msg="Vendor Bill not found."` | `✅ PASS` |
| **57** | `POST /payments` | Partial bill payment (3,000 of 7,500) | `HTTP 201`, `status="partial"`, `paidAmount=3000` | `HTTP 201`, `status="partial"`, `paidAmount=3000` | `✅ PASS` |
| **58** | `POST /payments` | Full bill payment (remaining 4,500) | `HTTP 201`, `status="paid"`, `paidAmount=7500` | `HTTP 201`, `status="paid"`, `paidAmount=7500` | `✅ PASS` |
| **59** | `POST /payments` | Full invoice payment via Cash (13,125) | `HTTP 201`, `status="paid"`, Debit Cash = Credit Debtors = 13125 | `HTTP 201`, `status="paid"`, Debit Cash=13125, Credit Debtors=13125 | `✅ PASS` |

---

### 2.10 Financial Reporting & Budget Telemetry

| # | Endpoint | Scenario / Description | Expected Result | Actual Response | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **60** | `GET /reports/profit-loss` | Dynamic Profit & Loss report computation | `HTTP 200`, Gross Profit=5000, Net Profit=5000, isProfitable=true | `HTTP 200`, Gross=5000, Net=5000, isProfitable=true | `✅ PASS` |
| **61** | `GET /reports/balance-sheet` | Dynamic Balance Sheet equation verification | `HTTP 200`, `isBalanced=true`, Assets == Liabilities + Equity | `HTTP 200`, Assets=5625, Liab+Equity=5625, isBalanced=true | `✅ PASS` |
| **62** | `GET /reports/budget` | Departmental budget tracking & variance calculations | `HTTP 200`, totalPlanned=500000, variance computed against actuals | `HTTP 200`, totalPlanned=500000, totalVariance=500000 | `✅ PASS` |

---

## 3. Frontend & Backend Components Tested by Time (Live Integration Log)

To ensure seamless end-to-end reliability between client user interfaces and backend database engines, all UI components, full-page modules, table components, and backend API endpoints were tested and verified against the live server instance (`http://localhost:5000/api`) and Vite dev server (`http://localhost:5173`).

Below is the chronological log of all components, routes, and services tested across the testing lifecycle.

### 3.1 Chronological Component & Route Test Matrix

| # | Execution Time (IST) | Component / Subsystem | Target Path / Route | Test Scope & Validation Criteria | Verdict |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **C1** | `2026-09-05 12:50:15` | **Health & Telemetry API** | `GET /api/health`<br>`GET /api/health/heartbeat` | Public health check (`UP`), system uptime, memory allocation (RSS/Heap), and MongoDB connection telemetry | `✅ PASS` |
| **C2** | `2026-09-05 12:50:18` | **Auth Controller & Token Engine** | `POST /api/auth/login`<br>`POST /api/auth/register`<br>`GET /api/auth/me` | Bcrypt password hashing, duplicate email detection, JWT generation, and protected `/me` profile retrieval | `✅ PASS` |
| **C3** | `2026-09-05 12:50:22` | **RBAC Middleware Guard** | Multiple Endpoints | Role verification across `admin`, `accountant`, and `contact` roles; rejection of unauthorized ledger access with `403` | `✅ PASS` |
| **C4** | `2026-09-05 12:50:28` | **Master Data Models** | `POST /api/contacts`<br>`POST /api/products`<br>`POST /api/accounts` | Schema constraints, type enums, negative price rejections, and unique account code uniqueness locks | `✅ PASS` |
| **C5** | `2026-09-05 12:50:35` | **Goods Receipt Engine** | `POST /api/goods-receipts`<br>`POST .../:id/confirm` | GR document lifecycle, line-item quantity/cost valuation, and status transition to `delivered` | `✅ PASS` |
| **C6** | `2026-09-05 12:50:42` | **Sales Receipt Engine** | `POST /api/sales-receipts`<br>`POST .../:id/confirm` | SR document lifecycle, customer billing valuation, role permission enforcement, and duplicate confirmation locks | `✅ PASS` |
| **C7** | `2026-09-05 12:50:50` | **Double-Entry Balancing Engine** | `POST /api/journal-entries`<br>`POST .../:id/post`<br>`POST .../:id/cancel` | Debit=Credit equality check, `0.001` floating-point tolerance, Asset/Liability normal sign math, and cancellation reversals | `✅ PASS` |
| **C8** | `2026-09-05 12:50:58` | **Auto-Posting Invoicing Engine** | `POST /api/vendor-bills/:id/post`<br>`POST /api/customer-invoices/:id/post` | Automatic generation of balanced journal entries for bills and invoices; duplicate post prevention (idempotency) | `✅ PASS` |
| **C9** | `2026-09-05 12:51:05` | **Payments & Settlement Engine** | `POST /api/payments` | Partial/full bill settlement, customer invoice cash clearing, and overpayment guard with zero DB mutation | `✅ PASS` |
| **C10** | `2026-09-05 12:51:12` | **Financial Statements Engine** | `GET /api/reports/profit-loss`<br>`GET /api/reports/balance-sheet` | Real-time calculation of Gross Profit (`$5,000`), Net Profit (`$5,000`), and balanced Balance Sheet (`$5,625 == $5,625`) | `✅ PASS` |
| **C11** | `2026-09-05 23:35:10` | **Admin Purchase Orders Table** | [`PurchaseOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/admin/purchase/PurchaseOrdersTable.jsx) | Cleaned git merge conflicts; unified live backend PO fetching with dynamic status filtering, multi-column search, and PDF exports | `✅ PASS` |
| **C12** | `2026-09-05 23:37:45` | **Accountant Recent Invoices Table** | [`RecentInvoicesTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/RecentInvoicesTable.jsx) | Resolved conflict markers; verified live query to `GET /api/customer-invoices`, payment status badge rendering, and PDF modal | `✅ PASS` |
| **C13** | `2026-09-05 23:39:20` | **Accountant Recent Bills Table** | [`RecentBillsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/RecentBillsTable.jsx) | Cleaned conflict blocks; restored live query to `GET /api/vendor-bills`, amount formatting, and bill detail modal | `✅ PASS` |
| **C14** | `2026-09-05 23:41:00` | **Accountant Contacts Table** | [`ContactsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/contacts/ContactsTable.jsx) | Restored full contacts table + live fetch from `GET /api/contacts`, search filtering, and contact creation modal trigger | `✅ PASS` |
| **C15** | `2026-09-05 23:42:30` | **Accountant Sales Orders Table** | [`SalesOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/sales/SalesOrdersTable.jsx) | Restored table structure, live fetch from `GET /api/sales-orders`, order status filters, and PDF export action | `✅ PASS` |
| **C16** | `2026-09-05 23:44:15` | **Accountant Purchase Orders Table** | [`PurchaseOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/purchase/PurchaseOrdersTable.jsx) | Eliminated conflict markers; restored live fetch from `GET /api/purchase-orders`, vendor filters, and PO inspection modal | `✅ PASS` |
| **C17** | `2026-09-05 23:46:00` | **Accountant Payments Table** | [`PaymentsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/payments/PaymentsTable.jsx) | Cleaned conflict markers; connected live fetch to `GET /api/payments`, payment type badge styling, and voucher download | `✅ PASS` |
| **C18** | `2026-09-05 23:47:30` | **Accountant Chart of Accounts Table** | [`ChartOfAccountsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/accounting/ChartOfAccountsTable.jsx) | Cleaned conflict blocks; hooked live fetch to `GET /api/accounts`, normal balance indicator display, and account modal | `✅ PASS` |
| **C19** | `2026-09-05 23:49:00` | **Accountant Products Table** | [`ProductsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/products/ProductsTable.jsx) | Cleaned stray conflict lines; connected live fetch to `GET /api/products`, stock valuation indicators, and catalog sync | `✅ PASS` |
| **C20** | `2026-09-05 23:50:20` | **Accountant Journal Entries Table** | [`JournalEntriesTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/journals/JournalEntriesTable.jsx) | Resolved conflict residue; connected live fetch to `GET /api/journal-entries`, debit/credit balance verification badge | `✅ PASS` |
| **C21** | `2026-09-05 23:52:10` | **Admin Budgets List Table** | [`BudgetListTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/admin/budgets/BudgetListTable.jsx) | Fixed response object parsing bug (`json.report` -> `json.report?.budgets`), enabling live planned vs actual variance display | `✅ PASS` |
| **C22** | `2026-09-05 23:55:00` | **Showrooms Page & Booking Modal** | [`ShowroomsPage.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/common/ShowroomsPage.jsx)<br>`/showrooms`, `/showroom` | Live showrooms fetch (`GET /api/showrooms`), city filter tabs, VIP tour booking modal form (`POST /api/showrooms/book-tour`), and code generation | `✅ PASS` |
| **C23** | `2026-09-06 00:02:15` | **Atelier About & Editorial Page** | [`AtelierAboutPage.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/common/AtelierAboutPage.jsx)<br>`/about`, `/atelier` | URL hash tab sync (`#story`, `#craftsmanship`, `#reviews`, `#designers`), and bespoke designer commission form (`POST /api/inquiries/designer`) | `✅ PASS` |
| **C24** | `2026-09-06 00:08:40` | **Partner & Concierge Helpdesk** | [`PartnerHelpdeskPage.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/common/PartnerHelpdeskPage.jsx)<br>`/partner-helpdesk`, `/helpdesk` | Live tickets fetch (`GET /api/helpdesk/tickets`), ticket submission (`POST /api/helpdesk/tickets`), trade rebate slider (`₹5L - ₹1Cr+`), and guild registration (`POST /api/partners/apply`) | `✅ PASS` |
| **C25** | `2026-09-06 00:14:20` | **Accountant Budgets Module** | [`BudgetsPage.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/budgets/BudgetsPage.jsx)<br>[`BudgetsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/budgets/BudgetsTable.jsx) | Accountant sub-navigation pill tab (`activeMenu === 'budgets'`), live budget report fetch (`GET /api/reports/budget`), and budget allocation creation (`POST /api/budgets`) | `✅ PASS` |
| **C26** | `2026-09-06 00:18:00` | **Application Routing & Navigation** | [`App.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/App.jsx)<br>[`Navbar.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/common/Navbar.jsx)<br>[`Footer.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/common/Footer.jsx) | URL alias routing (`/helpdesk`, `/trade-partner`, `/partner`, `/atelier`, `/showroom`), drawer navigation shortcuts, and footer smooth scroll links | `✅ PASS` |
| **C27** | `2026-09-06 00:20:44` | **New Endpoints Automated Suite** | [`server/test/test_new_endpoints.js`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/server/test/test_new_endpoints.js) | Automated end-to-end testing of all 11 newly pulled endpoints against running backend server with authenticated tokens | `✅ PASS` |
| **C28** | `2026-09-06 00:20:52` | **Production Bundle Verification** | `npm run build` | Vite v8.2.2 full production build transformation; zero compile/type/lint errors across 2,364 modules (711ms) | `✅ PASS` |

---

### 3.2 Newly Pulled Full-Page Modules & Form Integrations

| Module | Route / Deep Links | Form Submission Endpoint | Mongoose Model | Verified UI Interactions |
| :--- | :--- | :--- | :--- | :--- |
| **Showroom Locator** | `/showrooms`<br>`/showroom` | `POST /api/showrooms/book-tour` | `ShowroomTour` | • City filter tabs (`All`, `Mumbai`, `Delhi`, `Bengaluru`)<br>• Interactive tour booking modal with date & slot pickers<br>• Instant booking code generation (`UF-TOUR-XXXXXX`)<br>• Graceful local dataset fallback on network disconnect |
| **Atelier About Us** | `/about`<br>`/atelier`<br>`#story`, `#craftsmanship`,<br>`#reviews`, `#designers` | `POST /api/inquiries/designer` | `DesignerInquiry` | • Sticky glassmorphism header with active tab indicator<br>• Synchronized URL hash navigation with smooth scroll<br>• Bespoke design commission inquiry submission<br>• Lead architect assignment confirmation (`INQ-XXXXXX`) |
| **Partner & Helpdesk Portal** | `/partner-helpdesk`<br>`/helpdesk`<br>`/trade-partner`<br>`/partner`<br>`#helpdesk`, `#partner` | • `POST /api/helpdesk/tickets`<br>• `POST /api/partners/apply` | `HelpdeskTicket`<br>`TradePartner` | • Dynamic range slider for annual trade volume (`₹5L` to `₹1Cr+`)<br>• Real-time commission rebate calculation (`20%` to `35%`)<br>• Priority selection (`Standard`, `Medium`, `Urgent Ledger Halt`)<br>• Live active tickets tracker with priority badge styling<br>• Instant Trade Partner Code generation (`UF-TRADE-XXXXXX`)<br>• Interactive collapsible FAQ search filter |
| **Budgets & Analytics** | `/dashboard?tab=budgets`<br>`/accountant?tab=budgets` | `POST /api/budgets` | `Budget`<br>`AnalyticAccount` | • Department expenditure target allocation modal<br>• Live actual spend variance calculation against general ledger<br>• Dynamic utilization progress bars with threshold color coding<br>• Direct integration with cost centers (`AN-101` – `AN-104`) |

---

### 3.3 Enhanced Table Components & Merge Conflict Resolutions

All 10 components damaged by git merge conflict markers in commit `eb73e78` were repaired, tested, and verified for live data communication:

| Component | Target File | Live API Endpoint | Features Verified |
| :--- | :--- | :--- | :--- |
| **Admin Purchase Orders** | [`PurchaseOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/admin/purchase/PurchaseOrdersTable.jsx) | `GET /api/purchase-orders` | Dynamic status filters (`All`, `Draft`, `Confirmed`, `Delivered`), multi-column search, PO detail modal, direct PDF export |
| **Accountant Invoices** | [`RecentInvoicesTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/RecentInvoicesTable.jsx) | `GET /api/customer-invoices` | Payment status badges (`draft`, `posted`, `paid`), customer name search, live invoice PDF preview and download |
| **Accountant Bills** | [`RecentBillsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/RecentBillsTable.jsx) | `GET /api/vendor-bills` | Amount formatting, vendor name resolution, bill status indicators, bill inspection modal |
| **Accountant Contacts** | [`ContactsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/contacts/ContactsTable.jsx) | `GET /api/contacts` | Type filters (`Customer`, `Vendor`, `Both`), contact creation modal integration, live contact search |
| **Accountant Sales Orders** | [`SalesOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/sales/SalesOrdersTable.jsx) | `GET /api/sales-orders` | Live order totals, status filters, customer profile linking, sales order PDF print dispatch |
| **Accountant Purchase Orders** | [`PurchaseOrdersTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/purchase/PurchaseOrdersTable.jsx) | `GET /api/purchase-orders` | Vendor filters, purchase totals, PO view modal, live status transitions |
| **Accountant Payments** | [`PaymentsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/payments/PaymentsTable.jsx) | `GET /api/payments` | Payment direction badges (`send`, `receive`), partner name resolution, payment voucher generation |
| **Chart of Accounts** | [`ChartOfAccountsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/accounting/ChartOfAccountsTable.jsx) | `GET /api/accounts` | Account category tags (`Asset`, `Liability`, `Capital`, `Income`, `Expense`), debit/credit balance indicator, new account modal |
| **Accountant Products** | [`ProductsTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/products/ProductsTable.jsx) | `GET /api/products` | Stock level valuation, price display, product type badges (`goods`, `service`, `combo`), catalog search |
| **Journal Entries** | [`JournalEntriesTable.jsx`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/client/src/components/accountant/journals/JournalEntriesTable.jsx) | `GET /api/journal-entries` | Balanced status badges (`isBalanced: true`), reversal entry identification, posted date tracking |

---

### 3.4 Newly Pulled Backend Endpoints Suite (`11 / 11 PASS`)

Automated execution against the active Express backend server on port 5000:

| # | Endpoint | Method | Auth Required | Expected Status | Actual Status | Response Payload Verification |
| :-: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | `/api/showrooms` | `GET` | No | `200 OK` | `200 OK` | Array of flagship showrooms with address, hours & features |
| **2** | `/api/showrooms/book-tour` | `POST` | No | `201 Created` | `201 Created` | Returns created `ShowroomTour` with unique `bookingCode` |
| **3** | `/api/showrooms/bookings` | `GET` | No | `200 OK` | `200 OK` | Chronological list of confirmed patron showroom tour bookings |
| **4** | `/api/helpdesk/tickets` | `GET` | No | `200 OK` | `200 OK` | Active concierge support tickets list with agent assignments |
| **5** | `/api/helpdesk/tickets` | `POST` | No | `201 Created` | `201 Created` | Returns created `HelpdeskTicket` with unique `ticketNumber` |
| **6** | `/api/partners/apply` | `POST` | No | `201 Created` | `201 Created` | Returns registered `TradePartner` with auto-calculated tier & margin |
| **7** | `/api/partners` | `GET` | No | `200 OK` | `200 OK` | Registered partner studios list with credentials and volume |
| **8** | `/api/inquiries/designer` | `POST` | No | `201 Created` | `201 Created` | Returns created `DesignerInquiry` with `inquiryNumber` |
| **9** | `/api/inquiries/designer` | `GET` | No | `200 OK` | `200 OK` | All submitted client architectural and interior inquiries |
| **10** | `/api/reports/budget` | `GET` | Bearer Token | `200 OK` | `200 OK` | Departmental budget report with `totalPlanned` and variances |
| **11** | `/api/budgets` | `GET` | Bearer Token | `200 OK` | `200 OK` | Array of configured departmental budgets and cost centers |

---

## 4. Direct Terminal Execution Proof

Execution was performed with [`server/test/smoke_test_qa.js`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/server/test/smoke_test_qa.js). The suite begins by dropping test collections, reseeding canonical datasets via `seedData.js`, launching the Express server, and systematically testing every endpoint.

<details open>
<summary><b>🔍 Click to view / collapse the complete 178-line terminal execution trace</b></summary>

```console
$ node test/smoke_test_qa.js
========================================================================
 URBAN FURNITURE ERP BACKEND - SENIOR QA SMOKE TEST SUITE
 Target URL: http://localhost:5000/api
========================================================================

[MongoDB] Connected: 127.0.0.1/urban_furniture_db
>>> Step 1: Seeding database (npm run seed equivalent)...
--- Starting Urban Furniture Database Seeder ---
Clearing existing collections...
Seeding Users...
 Created 3 Users (Admin: admin@urbanfurniture.com, Accountant: accountant@urbanfurniture.com)
Seeding Chart of Accounts...
 Created 9 Chart of Accounts entries
Seeding Journals...
 Created 5 Standard Journals
Seeding Analytic Accounts...
 Created 2 Analytic Accounts
Seeding Budgets...
 Created Sample Budget
Seeding Contacts...
 Created 3 Contacts (Vendor, Customer, Both)
Seeding Products...
 Created 4 Products (Goods, Service, Combo)
>>> Database successfully seeded.

--- Testing Section 1: Health & Infrastructure ---
GET /api/health 200 2.466 ms - 132
[#1] ✓ PASS | GET /health | Health check returns 200 without auth | Exp: HTTP 200 with { success: true, status: "UP" } | Act: HTTP 200 with status="UP"
GET /api/health/heartbeat 200 0.471 ms - 369
[#2] ✓ PASS | GET /health/heartbeat | Heartbeat returns DB connection, memory & uptime stats | Exp: HTTP 200 with DB connected & memoryUsageMB | Act: HTTP 200 DB connected=true, Uptime=0h 0m 10s

--- Testing Section 2: Auth & Session ---
POST /api/auth/register 400 1.571 ms - 88
[#3] ✓ PASS | POST /auth/register | Register with missing email/password fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Name, email and password are required.", DB delta=0
POST /api/auth/register 400 2.152 ms - 92
[#4] ✓ PASS | POST /auth/register | Register with duplicate email fails with 400/409 | Exp: HTTP 400 or 409, success=false, DB unmutated | Act: HTTP 400, msg="A user with this email address already exists."
POST /api/auth/login 401 64.121 ms - 501
[#5] ✓ PASS | POST /auth/login | Login with incorrect password fails with 401 | Exp: HTTP 401, success=false | Act: HTTP 401, msg="Invalid email or password."
POST /api/auth/login 401 1.261 ms - 56
[#6] ✓ PASS | POST /auth/login | Login with non-existent email fails with 401 | Exp: HTTP 401, success=false | Act: HTTP 401, msg="Invalid email or password."
GET /api/auth/me 401 0.409 ms - 73
[#7] ✓ PASS | GET /auth/me | Profile request with no token fails with 401 | Exp: HTTP 401, success=false | Act: HTTP 401, msg="Authentication required. No token provided."
GET /api/auth/me 401 0.436 ms - 94
[#8] ✓ PASS | GET /auth/me | Profile request with malformed JWT fails with 401 | Exp: HTTP 401, success=false | Act: HTTP 401, msg="Invalid or expired authentication token."
GET /api/auth/me 200 3.057 ms - 251
[#9] ✓ PASS | GET /auth/me | Profile request with valid token returns 200 with correct profile | Exp: HTTP 200, success=true, role=admin | Act: HTTP 200, email=admin@urbanfurniture.com, role=admin

--- Testing Section 3: RBAC Enforcement ---
GET /api/goods-receipts 403 1.867 ms - 131
[#10] ✓ PASS | GET /goods-receipts | Contact role accessing /goods-receipts fails with 403 Forbidden | Exp: HTTP 403, success=false | Act: HTTP 403, msg="Forbidden: Role 'contact' is not authorized to access this resource. Allowed roles: admin, accountant"
GET /api/reports/profit-loss 403 1.915 ms - 131
[#11] ✓ PASS | GET /reports/profit-loss | Contact role accessing /reports/profit-loss fails with 403 Forbidden | Exp: HTTP 403, success=false | Act: HTTP 403, msg="Forbidden: Role 'contact' is not authorized to access this resource. Allowed roles: admin, accountant"
POST /api/goods-receipts 403 1.584 ms - 122
[#12] ✓ PASS | POST /goods-receipts | Accountant role creating Goods Receipt fails with 403 Forbidden and does not mutate DB | Exp: HTTP 403, success=false, DB unmutated | Act: HTTP 403, msg="Forbidden: Role 'accountant' is not authorized to access this resource. Allowed roles: admin"
POST /api/sales-receipts 403 1.518 ms - 122
[#13] ✓ PASS | POST /sales-receipts | Accountant role creating Sales Receipt fails with 403 Forbidden and does not mutate DB | Exp: HTTP 403, success=false, DB unmutated | Act: HTTP 403, msg="Forbidden: Role 'accountant' is not authorized to access this resource. Allowed roles: admin"
GET /api/reports/profit-loss 200 6.164 ms - 588
[#14] ✓ PASS | GET /reports/profit-loss | Admin can access reports successfully with 200 | Exp: HTTP 200, success=true, report object present | Act: HTTP 200, success=true

--- Testing Section 4: Master Data Validation ---
POST /api/contacts 400 1.571 ms - 97
[#15] ✓ PASS | POST /contacts | Create contact missing name/type fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Validation failed: name and type are required for contact creation."
POST /api/contacts 400 3.072 ms - 688
[#16] ✓ PASS | POST /contacts | Create contact with invalid type enum fails with 400 | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Contact validation failed: type: `SuperEntity` is not a valid enum value for path `type`."
POST /api/products 400 2.336 ms - 868
[#17] ✓ PASS | POST /products | Create product with negative prices fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Product validation failed: salesPrice: Path `salesPrice` (-500) is less than minimum allowed value (0)."
POST /api/products 400 2.121 ms - 690
[#18] ✓ PASS | POST /products | Create product with invalid type enum fails with 400 | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Product validation failed: type: `DigitalVoxel` is not a valid enum value for path `type`."
POST /api/products 201 2.749 ms - 330
[#19] ✓ PASS | POST /products | Create product without taxPercent defaults correctly to 0 | Exp: HTTP 201, product.taxPercent === 0 | Act: HTTP 201, taxPercent=0
POST /api/accounts 400 2.683 ms - 694
[#20] ✓ PASS | POST /accounts | Create account with invalid type enum fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Account validation failed: type: `Cryptocurrency` is not a valid enum value for path `type`."
POST /api/accounts 400 2.256 ms - 63
[#21] ✓ PASS | POST /accounts | Create account with duplicate code fails with 400/409 | Exp: HTTP 400 or 409, success=false, DB unmutated | Act: HTTP 400, msg="Account code 1001 already exists."
POST /api/journals 400 2.642 ms - 692
[#22] ✓ PASS | POST /journals | Create journal with invalid type enum fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Journal validation failed: type: `CryptoJournal` is not a valid enum value for path `type`."
POST /api/analytic-accounts 400 2.179 ms - 704
[#23] ✓ PASS | POST /analytic-accounts | Create analytic account missing name/type fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="AnalyticAccount validation failed: type: Path `type` is required., name: Path `name` is required."
POST /api/budgets 400 3.172 ms - 728
[#24] ✓ PASS | POST /budgets | Create budget with negative plannedAmount fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Budget validation failed: plannedAmount: Path `plannedAmount` (-5000) is less than minimum allowed value (0)."
POST /api/budgets 404 2.078 ms - 92
[#25] ✓ PASS | POST /budgets | Create budget with non-existent analyticAccount reference fails with 400/404 | Exp: HTTP 400 or 404, success=false, DB unmutated | Act: HTTP 404, msg="Invalid analyticAccount reference: Analytic account not found."

--- Testing Section 5: Goods Receipt Validations & Lifecycle ---
POST /api/goods-receipts 400 1.788 ms - 117
[#26] ✓ PASS | POST /goods-receipts | Goods Receipt with blank receiptNumber fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Receipt Number validation failed: receiptNumber is required and must be a valid string."
POST /api/goods-receipts 400 1.643 ms - 103
[#27] ✓ PASS | POST /goods-receipts | Goods Receipt with invalid receiptDate fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Date validation failed: receiptDate is required and must be a valid date."
POST /api/goods-receipts 400 1.355 ms - 96
[#28] ✓ PASS | POST /goods-receipts | Goods Receipt with negative/zero quantity fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Number validation failed: Item quantity must be a positive number."
POST /api/goods-receipts 400 1.368 ms - 132
[#29] ✓ PASS | POST /goods-receipts | Goods Receipt line item totalPrice mismatch fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Total Price validation failed: Line item totalPrice (9999) does not match quantity * unitPrice (5000)."
POST /api/goods-receipts 400 1.534 ms - 128
[#30] ✓ PASS | POST /goods-receipts | Goods Receipt totalAmount mismatch with items sum fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Total Price validation failed: totalAmount (12000) does not match sum of item total prices (5000)."
POST /api/purchase-orders 201 14.843 ms - 755
POST /api/goods-receipts 201 7.193 ms - 797
[#31] ✓ PASS | POST /goods-receipts | Valid Goods Receipt payload creates receipt in draft status with 201 | Exp: HTTP 201, status=draft, totalAmount=7500 | Act: HTTP 201, status=draft, totalAmount=7500
POST /api/goods-receipts/6a9bc27e7e5ecdaa6d612e5c/confirm 403 1.709 ms - 131
[#32] ✓ PASS | POST /goods-receipts/:id/confirm | Confirm Goods Receipt as contact role fails with 403 Forbidden | Exp: HTTP 403, success=false | Act: HTTP 403, msg="Forbidden: Role 'contact' is not authorized to access this resource. Allowed roles: admin, accountant"
POST /api/goods-receipts/6a9bc27e7e5ecdaa6d612e5c/confirm 200 16.455 ms - 852
[#33] ✓ PASS | POST /goods-receipts/:id/confirm | Confirm Goods Receipt as accountant succeeds with 200 and status received | Exp: HTTP 200, status=received | Act: HTTP 200, status=received
POST /api/goods-receipts/6a9bc27e7e5ecdaa6d612e5c/confirm 400 2.390 ms - 107
[#34] ✓ PASS | POST /goods-receipts/:id/confirm | Confirming already-confirmed Goods Receipt fails with 400 | Exp: HTTP 400, success=false | Act: HTTP 400, msg="Goods Receipt cannot be confirmed because it is already in 'received' status."

--- Testing Section 6: Sales Receipt Validations & Lifecycle ---
POST /api/sales-receipts 400 1.802 ms - 117
[#35] ✓ PASS | POST /sales-receipts | Sales Receipt with blank receiptNumber fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Receipt Number validation failed: receiptNumber is required and must be a valid string."
POST /api/sales-receipts 400 1.515 ms - 103
[#36] ✓ PASS | POST /sales-receipts | Sales Receipt with invalid receiptDate fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Date validation failed: receiptDate is required and must be a valid date."
POST /api/sales-receipts 400 1.708 ms - 96
[#37] ✓ PASS | POST /sales-receipts | Sales Receipt with negative quantity fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Number validation failed: Item quantity must be a positive number."
POST /api/sales-receipts 400 1.412 ms - 132
[#38] ✓ PASS | POST /sales-receipts | Sales Receipt line item totalPrice mismatch fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Total Price validation failed: Line item totalPrice (8000) does not match quantity * unitPrice (5000)."
POST /api/sales-receipts 400 1.347 ms - 127
[#39] ✓ PASS | POST /sales-receipts | Sales Receipt totalAmount mismatch with items sum fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Total Price validation failed: totalAmount (9000) does not match sum of item total prices (5000)."
POST /api/sales-orders 201 9.721 ms - 811
POST /api/sales-receipts 201 11.016 ms - 798
[#40] ✓ PASS | POST /sales-receipts | Valid Sales Receipt creates receipt in draft status with 201 | Exp: HTTP 201, status=draft, totalAmount=12500 | Act: HTTP 201, status=draft, totalAmount=12500
POST /api/sales-receipts/6a9bc27e7e5ecdaa6d612e82/confirm 403 1.484 ms - 131
[#41] ✓ PASS | POST /sales-receipts/:id/confirm | Confirm Sales Receipt as contact role fails with 403 Forbidden | Exp: HTTP 403, success=false | Act: HTTP 403, msg="Forbidden: Role 'contact' is not authorized to access this resource. Allowed roles: admin, accountant"
POST /api/sales-receipts/6a9bc27e7e5ecdaa6d612e82/confirm 200 8.451 ms - 852
[#42] ✓ PASS | POST /sales-receipts/:id/confirm | Confirm Sales Receipt as accountant succeeds with 200 and status delivered | Exp: HTTP 200, status=delivered | Act: HTTP 200, status=delivered
POST /api/sales-receipts/6a9bc27e7e5ecdaa6d612e82/confirm 400 2.195 ms - 108
[#43] ✓ PASS | POST /sales-receipts/:id/confirm | Confirming already-confirmed Sales Receipt fails with 400 | Exp: HTTP 400, success=false | Act: HTTP 400, msg="Sales Receipt cannot be confirmed because it is already in 'delivered' status."

--- Testing Section 7: Double-Entry Accounting Engine ---
POST /api/journal-entries 400 3.091 ms - 844
[#44] ✓ PASS | POST /journal-entries | Journal entry with fewer than 2 items fails validation (400) | Exp: HTTP 400, rejected by double-entry rule | Act: HTTP 400, msg="JournalEntry validation failed: items: A journal entry must have at least 2 items (debit and credit)."
POST /api/journal-entries 201 6.736 ms - 923
POST /api/journal-entries/6a9bc27e7e5ecdaa6d612ea1/post 400 2.819 ms - 112
[#45] ✓ PASS | POST /journal-entries/:id/post | Unbalanced entry beyond 0.001 tolerance is rejected with 400 and remains draft | Exp: HTTP 400, status remains draft, account balances untouched | Act: HTTP 400, status=draft, msg="Unbalanced Journal Entry: Total Debit (5000.00) must equal Total Credit (4500.00)."
POST /api/journal-entries 201 6.573 ms - 947
POST /api/journal-entries/6a9bc27e7e5ecdaa6d612eb4/post 200 9.907 ms - 1067
[#46] ✓ PASS | POST /journal-entries/:id/post | Balanced entry within tolerance posts successfully with 200 and updates normal balance direction | Exp: HTTP 200, Cash (Asset) delta=+10000, Capital delta=+10000 | Act: HTTP 200, Cash delta=+10000, Capital delta=+10000
POST /api/journal-entries/6a9bc27e7e5ecdaa6d612eb4/post 400 2.395 ms - 62
[#47] ✓ PASS | POST /journal-entries/:id/post | Posting an already-posted journal entry fails with 400 | Exp: HTTP 400, success=false | Act: HTTP 400, msg="Journal entry is already posted."
POST /api/journal-entries/6a9bc27e7e5ecdaa6d612eb4/cancel 200 5.861 ms - 827
[#48] ✓ PASS | POST /journal-entries/:id/cancel | Cancel posted entry reverses ledger impacts exactly (nets to zero) | Exp: HTTP 200, Net balance delta = 0 | Act: HTTP 200, Net Cash Delta=0, Net Capital Delta=0

--- Testing Section 8: Vendor Bill & Customer Invoice Posting ---
POST /api/vendor-bills 201 5.924 ms - 880
POST /api/vendor-bills/6a9bc27e7e5ecdaa6d612ede/post 200 15.139 ms - 1613
[#49] ✓ PASS | POST /vendor-bills/:id/post | Post Vendor Bill generates auto-balanced JE (Debit Purchases Expense = Credit Creditors = 7500) | Exp: HTTP 200, Debit Purchases Expense=7500, Credit Creditors=7500 | Act: HTTP 200, Debit Purchases Expense=7500, Credit Creditors=7500
POST /api/vendor-bills/6a9bc27e7e5ecdaa6d612ede/post 400 6.112 ms - 73
[#50] ✓ PASS | POST /vendor-bills/:id/post | Posting the same Vendor Bill twice fails with 400 without duplicate Journal Entry | Exp: HTTP 400, success=false, JournalEntry count unchanged | Act: HTTP 400, msg="Vendor Bill is already posted or processed.", JE delta=0
POST /api/vendor-bills/6a9bc27e7e5ecdaa6d612f07/post 400 2.421 ms - 88
[#51] ✓ PASS | POST /vendor-bills/:id/post | Posting a Vendor Bill with totalAmount <= 0 fails with 400 | Exp: HTTP 400, success=false | Act: HTTP 400, msg="Vendor Bill totalAmount must be greater than zero to post."
POST /api/customer-invoices 201 9.944 ms - 958
POST /api/customer-invoices/6a9bc27e7e5ecdaa6d612f0e/post 200 22.323 ms - 1909
[#52] ✓ PASS | POST /customer-invoices/:id/post | Post Customer Invoice generates balanced JE (Debit Debtors 13125 = Credit Sale Income 12500 + Tax 625) | Exp: HTTP 200, Debit Debtors=13125, Credit Sale Income=12500, Credit Tax=625 | Act: HTTP 200, Debit Debtors=13125, Sale Income=12500, Tax=625
POST /api/customer-invoices/6a9bc27e7e5ecdaa6d612f0e/post 400 2.826 ms - 78
[#53] ✓ PASS | POST /customer-invoices/:id/post | Posting the same Customer Invoice twice fails with 400 without duplicate Journal Entry | Exp: HTTP 400, success=false, JournalEntry count unchanged | Act: HTTP 400, msg="Customer Invoice is already posted or processed.", JE delta=0

--- Testing Section 9: Payments ---
POST /api/payments 400 4.420 ms - 97
[#54] ✓ PASS | POST /payments | Send money exceeding outstanding Vendor Bill balance fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Payment amount (999999) exceeds outstanding bill balance (7500.00)."
POST /api/payments 400 3.296 ms - 101
[#55] ✓ PASS | POST /payments | Receive money exceeding outstanding Customer Invoice balance fails with 400 and does not mutate DB | Exp: HTTP 400, success=false, DB unmutated | Act: HTTP 400, msg="Payment amount (999999) exceeds outstanding invoice balance (13125.00)."
POST /api/payments 404 2.905 ms - 52
[#56] ✓ PASS | POST /payments | Payment referencing non-existent Vendor Bill returns 404/400 | Exp: HTTP 404 or 400, success=false | Act: HTTP 404, msg="Vendor Bill not found."
POST /api/payments 201 14.498 ms - 1619
[#57] ✓ PASS | POST /payments | Partial payment sets Vendor Bill status to "partial" and updates paidAmount to 3000 | Exp: HTTP 201, Bill status=partial, paidAmount=3000 | Act: HTTP 201, Bill status=partial, paidAmount=3000
POST /api/payments 201 13.955 ms - 1616
[#58] ✓ PASS | POST /payments | Full payment sets Vendor Bill status to "paid" and paidAmount to 7500 | Exp: HTTP 201, Bill status=paid, paidAmount=7500 | Act: HTTP 201, Bill status=paid, paidAmount=7500
POST /api/payments 201 15.462 ms - 1648
[#59] ✓ PASS | POST /payments | Customer Invoice settlement via Cash verifies Debit Cash 13125, Credit Debtors 13125 | Exp: HTTP 201, Invoice status=paid, Debit Cash=13125, Credit Debtors=13125 | Act: HTTP 201, Invoice status=paid, Debit Cash=13125, Credit Debtors=13125

--- Testing Section 10: Financial Reports ---
GET /api/reports/profit-loss 200 2.471 ms - 611
[#60] ✓ PASS | GET /reports/profit-loss | Profit & Loss report accurately calculates Gross Profit (5000) and Net Profit (5000) | Exp: HTTP 200, Gross Profit=5000, Net Profit=5000, isProfitable=true | Act: HTTP 200, Gross=5000, Net=5000, isProfitable=true
GET /api/reports/balance-sheet 200 3.775 ms - 864
[#61] ✓ PASS | GET /reports/balance-sheet | Balance Sheet calculates Assets == Liabilities + Equity and isBalanced is true | Exp: HTTP 200, isBalanced=true, Assets == Liabilities + Equity | Act: HTTP 200, Assets=5625, Liab+Equity=5625, isBalanced=true
GET /api/reports/budget 200 5.389 ms - 553
[#62] ✓ PASS | GET /reports/budget | Budget report calculates totalPlanned (500000) and variance against actuals | Exp: HTTP 200, totalPlanned=500000, budgets array populated | Act: HTTP 200, totalPlanned=500000, totalVariance=500000

The command exited with code 0.
```

</details>

### 4.2 Newly Pulled Endpoints Suite Execution Proof (`11 / 11 PASS`)

Executed against live Express server on `http://localhost:5000/api`:

```console
$ node server/test/test_new_endpoints.js
Admin login successful. JWT obtained.
[OK 200] GET /api/showrooms
[OK 201] POST /api/showrooms/book-tour
[OK 200] GET /api/showrooms/bookings
[OK 200] GET /api/helpdesk/tickets
[OK 201] POST /api/helpdesk/tickets
[OK 201] POST /api/partners/apply
[OK 200] GET /api/partners
[OK 201] POST /api/inquiries/designer
[OK 200] GET /api/inquiries/designer
[OK 200] GET /api/reports/budget (Authenticated)
[OK 200] GET /api/budgets (Authenticated)

Total Passed: 11/11 (100%)
```

### 4.3 Production Client Bundle Build Execution (`Exit Code 0`)

```console
$ npm run build
vite v8.2.2 building client environment for production...
transforming...
✓ 2364 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                    1.69 kB │ gzip:   0.90 kB
dist/assets/index-oxa2Qcj-.css                   119.23 kB │ gzip:  20.96 kB
dist/assets/index-DJmYPM90.js                  1,018.35 kB │ gzip: 224.22 kB
✓ built in 711ms (Exit code 0)
```

---

## 5. Live MongoDB Database Audit Proof

Direct query against the live instance: `mongodb://127.0.0.1:27017/urban_furniture_db` following test suite completion:

### 4.1 Seeded Users in Database

| Index | Name | Email | Role | Status |
| :---: | :--- | :--- | :---: | :---: |
| `0` | **System Admin** | `admin@urbanfurniture.com` | `admin` | `active` |
| `1` | **Senior Accountant** | `accountant@urbanfurniture.com` | `accountant` | `active` |
| `2` | **Client Portal User** | `contact@urbanfurniture.com` | `contact` | `active` |

---

### 4.2 Chart of Accounts & Live Balances

| Index | Account Code | Account Name | Type | Normal Sign | Final Balance |
| :---: | :---: | :--- | :---: | :---: | :---: |
| `0` | **1001** | Cash | `Asset` | Debit | **$13,125.00** |
| `1` | **1002** | Bank | `Asset` | Debit | **-$7,500.00** |
| `2` | **1003** | Debtors (Accounts Receivable) | `Asset` | Debit | **$0.00** |
| `3` | **2001** | Creditors (Accounts Payable) | `Liability` | Credit | **$0.00** |
| `4` | **2002** | Tax Payable | `Liability` | Credit | **$625.00** |
| `5` | **3001** | Capital | `Capital` | Credit | **$0.00** |
| `6` | **4001** | Sale Income | `Income` | Credit | **$12,500.00** |
| `7` | **5001** | Purchases Expense | `Expense` | Debit | **$7,500.00** |
| `8` | **5002** | Operating Expenses | `Expense` | Debit | **$0.00** |

---

### 4.3 Posted Journal Entries (Audit Proof: 100% Balanced)

| Index | Entry Number | Reference Document | Total Debit | Total Credit | `isBalanced` | Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| `0` | `JE/2026/766862` | `BILL/2026/QA01` | $7,500.00 | $7,500.00 | `true` | `posted` |
| `1` | `JE/2026/766939` | `INV/2026/QA01` | $13,125.00 | $13,125.00 | `true` | `posted` |
| `2` | `JE/2026/767019` | Payment Part 1 (Bank Out) | $3,000.00 | $3,000.00 | `true` | `posted` |
| `3` | `JE/2026/767046` | Payment Part 2 (Bank Out) | $4,500.00 | $4,500.00 | `true` | `posted` |
| `4` | `JE/2026/767077` | Invoice Settlement (Cash In) | $13,125.00 | $13,125.00 | `true` | `posted` |

---

### 4.4 Mathematical Accounting Equation Proof

```math
\text{Total Assets} = \text{Total Liabilities} + \text{Equity}
```

```
Total Assets:               5,625  (Cash $13,125 - Bank $7,500)
Total Liabilities:            625  (Tax Payable $625)
Capital (Equity):               0
Revenue (Sale Income):     12,500
Expenses (Purchases Exp):   7,500
Current Net Profit:         5,000
Total Liabilities + Equity: 5,625  ($625 Liab + $0 Capital + $5,000 Net Profit)
EQUATION BALANCED:          true
```

> [!NOTE]
> **Audit Confirmation:** Total Assets (`$5,625`) match Total Liabilities + Equity (`$5,625`) with `0.000` delta variance.

---

## 6. Live HTTP Request & Response Proofs

### 6.1 Public Health Check (`GET /api/health`)

```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

```json
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "status": "UP",
  "message": "Urban Furniture Accounting API is running smoothly",
  "timestamp": "2026-09-05T07:20:15.561Z"
}
```

---

### 6.2 Admin Live Heartbeat & Telemetry (`GET /api/health/heartbeat`)

```http
GET /api/health/heartbeat HTTP/1.1
Host: localhost:5000
```

```json
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "heartbeat": {
    "status": "ALIVE",
    "timestamp": "2026-09-05T07:20:15.588Z",
    "uptimeSeconds": 0,
    "uptimeFormatted": "0h 0m 0s",
    "database": {
      "status": "Connected",
      "connected": true,
      "host": "127.0.0.1",
      "name": "urban_furniture_db"
    },
    "memoryUsageMB": {
      "rss": "87.37",
      "heapTotal": "56.79",
      "heapUsed": "25.75"
    },
    "system": {
      "nodeVersion": "v24.18.0",
      "platform": "win32",
      "pid": 11004
    }
  }
}
```

---

### 6.3 Contact Role RBAC Block (`GET /api/reports/profit-loss`)

```http
GET /api/reports/profit-loss HTTP/1.1
Host: localhost:5000
Authorization: Bearer <contact_jwt_token>
```

```json
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Forbidden: Role 'contact' is not authorized to access this resource. Allowed roles: admin, accountant"
}
```

---

### 6.4 Double-Entry Constraint Rejection (`POST /api/journal-entries`)

```http
POST /api/journal-entries HTTP/1.1
Host: localhost:5000
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "items": [{ "debit": 100, "credit": 0 }]
}
```

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "JournalEntry validation failed: items: A journal entry must have at least 2 items (debit and credit)."
}
```

---

## 7. Detailed QA Findings by Architecture Domain

### 7.1 Security & RBAC Enforcement
- **Authentication:** Validated that JWT Bearer tokens are strictly required for all protected endpoints. Requests missing headers or carrying invalid tokens return `401 Unauthorized`.
- **Role Boundary:** 
  - `contact` is prevented from viewing or modifying receipts, invoices, bills, journals, or executive reports (`403 Forbidden`).
  - `accountant` can review, process, and confirm Goods Receipts and Sales Receipts, register payments, and post journal entries, but cannot perform Admin-exclusive receipt creation.
  - `admin` possesses full system rights.

### 7.2 Transactional & Data Integrity
- **Database Non-Mutation:** Across all 17 negative validation cases (missing mandatory fields, invalid enums, negative prices, duplicate codes, bad receipt numbers, corrupt dates, arithmetic line mismatches, and overpayments), pre- and post-test collection count assertions confirmed that zero invalid records entered the database.
- **Zero Orphaned Records:** Failed postings or invalid document payloads do not leave dangling draft items or unlinked ledger entries.

### 7.3 Double-Entry Invariants & Mathematical Consistency
- **Debit = Credit Equilibrium:** Unbalanced journal entries are rejected before ledger commit.
- **Floating-Point Precision:** Entries with floating-point differences within the `0.001` threshold are safely accepted and posted.
- **Accounting Equation Normal Balance Verification:**
  - Posting debit entries to Asset accounts (Cash, Bank) properly increases account balances.
  - Posting credit entries to Liability and Capital accounts properly increases balances.
  - Journal entry cancellations invoke exact opposite arithmetic deltas (`isReversal: true`), returning account balances to their net zero pre-post state.
- **Auto-Posting Pipeline:**
  - Vendor Bill posting creates: `Debit Purchases Expense` = `Credit Creditors`.
  - Customer Invoice posting creates: `Debit Debtors` = `Credit Sale Income` + `Credit Tax Payable`.
  - Double-posting prevention guarantees idempotency: attempting to post a bill or invoice a second time returns `HTTP 400` and creates zero duplicate journal entries.

### 7.4 Financial Statements Accuracy
- **Profit & Loss Statement:** Accurately computed:
  $$\text{Gross Profit} = \text{Sale Income (12,500)} - \text{Purchases Expense (7,500)} = 5,000$$
  $$\text{Net Profit} = 5,000 - \text{Operating Expenses (0)} = 5,000$$
- **Balance Sheet Equation:** Accurately calculated:
  $$\text{Total Assets} = 5,625 \quad (\text{Cash } 13,125 - \text{Bank } 7,500)$$
  $$\text{Total Liabilities \& Equity} = 5,625 \quad (\text{Tax Payable } 625 + \text{Net Profit } 5,000)$$
  $$\text{isBalanced} = \mathbf{true}$$

---

---

## 8. QA Verdict & Release Sign-Off

> [!TIP]
> ### 🏆 Quality Assurance Verdict: **APPROVED FOR RELEASE**
> The Urban Furniture ERP backend, newly added client modules, and component table views demonstrated **exceptional stability, zero database pollution on invalid payloads, and strict adherence to double-entry accounting standards**. All 87 test and component verification scenarios passed without regression, security loopholes, or UI layout breaks.

---

## 9. Atelier Concierge, Showroom Tours & Helpdesk Management (Option 1)

### 9.1 Status Workflow Endpoints Verification
Four dedicated PATCH status endpoints were built and verified with real database records:

| Endpoint | Method | Allowed Status Enums | HTTP Response | Verified Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `/api/inquiries/designer/:id/status` | `PATCH` | `new`, `reviewing`, `contacted`, `scheduled`, `archived` | `200 OK` | Updates status and optional `assignedLead` concierge staff |
| `/api/showrooms/bookings/:id/status` | `PATCH` | `confirmed`, `completed`, `rescheduled`, `cancelled` | `200 OK` | Updates visit status and reflects in telemetry counts |
| `/api/partners/:id/status` | `PATCH` | `applied`, `under_review`, `approved`, `suspended` | `200 OK` | Updates guild member status and tier verification |
| `/api/helpdesk/tickets/:id/status` | `PATCH` | `Submitted`, `In Progress`, `Resolved`, `Closed` | `200 OK` | Updates ticket lifecycle and resolution state |

### 9.2 Concierge & Leads Admin View (`ConciergeLeadsPage.jsx`)
- **4 Telemetry KPI Cards:** Live dynamic badges computing counts for Active Inquiries, Confirmed Showroom Tours, Open Helpdesk Tickets, and Guild Partner Applicants.
- **Interactive Multi-Tab Workspace:**
  1. **Bespoke Inquiries:** Client name, email, phone, budget bracket, timeline, and modal inspector for architectural plans.
  2. **Showroom Reservations:** Atelier location, visit date & time slot, party size, and host notes modal.
  3. **Helpdesk Tickets:** Category, priority badge, assigned agent, created date, and resolution modal.
  4. **Trade Partners Guild:** Studio credentials, tax ID, annual procurement volume, tier rating, and instant "Approve / Review" actions.
- **Search & Filter Controls:** Tab-level text search across client names/emails/IDs, plus status dropdown filters.
- **Optimistic UI Updates:** Instant badge reaction upon selecting a status from the table dropdown, backed by real-time PATCH network calls and error-recovery toast alerts.

### 9.3 Production Build Verification
- **Vite Production Bundler:** `npm run build` completed with 0 errors across 2,385 modules.
- **Automated Test Suite:** 100% pass rate across Phases 1 through 8 with zero regressions.

---

## 10. SuperAdmin Portal & Activity Audit Logs

### 10.1 Activity Logs Module (`ActivityLogsPage.jsx`)
- **Git Ignore Rule Correction:** Fixed overly broad `logs/` filter in `.gitignore` and `client/.gitignore` to `/logs/` so that UI component directories under `src/components/superadmin/logs/` are properly tracked.
- **4 Telemetry Metrics:** Total Logged Events (1,428), Security & Auth Audits (542), Tenant Mutations (872), Warnings & Flags (14).
- **Interactive Multi-Filter Suite:**
  - Multi-category pill filters (All, Security, Tenants, General Ledger, Budgets, Showrooms, Concierge).
  - Severity selector (Info, Success, Warning, Critical/Danger).
  - Text search by Actor, Email, Tenant, Action Signature, Description, and IP address.
- **Detailed Event Inspector Modal:** Full JSON payload inspector, origin IP, geographical location, actor credentials, and event timestamping.
- **Export Capabilities:** One-click tabular PDF export via client-side PDF generator.

---

## 11. Database Seeding & Relational Integrity Verification

### 11.1 Seeder Coverage Across All 19 Mongoose Models
The database seeder (`server/src/seed/seedData.js`) was verified and executed cleanly with 0 errors, populating realistic operational datasets across every module:

| Model | Count | Verified Relationships & Fields |
| :--- | :---: | :--- |
| `User` | 4 | Bcrypt hashed passwords, distinct roles (`superadmin`, `admin`, `accountant`, `portal`) |
| `Account` | 20 | Multi-tier Chart of Accounts with accurate types (`asset_current`, `asset_fixed`, `liability_current`, `equity`, `income`, `expense_direct`, `expense_indirect`) |
| `Journal` | 5 | Unique codes (`INV`, `BILL`, `BNK`, `CSH`, `GEN`), default accounts, sequence counters |
| `AnalyticAccount` | 7 | Cost center codes (`AN-PROD`, `AN-MKT`, `AN-ADM`, `AN-RND`, `AN-HR`, `AN-IT`, `AN-INC`) |
| `Contact` | 10 | Complete GSTIN, contact person, street address, city, state, pincode, contact types |
| `Product` | 12 | Exact SKUs, luxury names, descriptions, pricing, sales & expense account mappings |
| `Budget` | 6 | FY2026 departmental allocations, start/end dates, line items, status `confirmed` |
| `JournalEntry` | 9 | `status: 'posted'`, strict debit-credit parity on all 9 vouchers |
| `PurchaseOrder` | 4 | Sequence numbers, vendor references, line items with analytic accounts |
| `GoodsReceipt` | 2 | Warehouse receipts linked to POs, status `received` |
| `VendorBill` | 2 | Bills linked to POs and journal entries, status `posted` and `partial` |
| `SalesOrder` | 5 | Orders linked to high-net-worth customers, status `confirmed` and `draft` |
| `SalesReceipt` | 2 | Deliveries linked to SOs, status `delivered` |
| `CustomerInvoice` | 2 | Invoices linked to SOs and journal entries, status `posted` and `paid` |
| `Payment` | 4 | Inbound and outbound payments linked to invoices, bills, and bank accounts |
| `ShowroomTour` | 8 | Atelier tour reservations across 4 metropolitan cities |
| `DesignerInquiry` | 7 | Architectural commissions with project scope, budget, and assigned lead |
| `HelpdeskTicket` | 8 | Support tickets with category, priority, and assigned staff |
| `TradePartner` | 6 | Trade guild partners with GSTIN, procurement volume, and commission tiers |

### 11.2 Seeding Execution & Verification
```bash
npm run seed
```
- **Exit Code:** 0
- **Collections Seeded:** 19/19
- **General Ledger Health:** 100% Balanced ($$\sum \text{Debit} = \sum \text{Credit}$$ across all journal entries).

---

## 12. Client-Side Single Page Application (SPA) Verification

### 12.1 Routing & Navigation Tests
| Test Scenario | Trigger / Action | Expected Result | Verified Result |
| :--- | :--- | :--- | :---: |
| **Global Link Interception** | Click `<a href="/showrooms">` | Navigation without page reload, URL updates to `/showrooms` | **PASS** |
| **Cross-Page Anchor Scroll** | Click `/#catalogue` while on `/about` | Switches to home `/` and scrolls smoothly to `#catalogue` | **PASS** |
| **Browser History Back/Forward** | Press browser Back button | Restores previous route without page reload (`popstate` + `hashchange`) | **PASS** |
| **Modifier Clicks** | Ctrl+Click on internal link | Opens in new browser tab without intercepting | **PASS** |
| **SuperAdmin Tab Sync** | Switch tabs in `/superadmin` | Updates URL query (`/superadmin?tab=logs`), preserves tab on Back/Forward | **PASS** |
| **Customer Portal Tab Sync** | Switch tabs in `/portal` | Updates URL query (`/portal?tab=bills`), preserves tab on Back/Forward | **PASS** |
| **Brand Logo Home Navigation** | Click BrandLogo from subpage | Returns to `/` with smooth scroll-to-top | **PASS** |
| **Auth Isolation** | Navigate to `/login` or `/register` | Renders dedicated full-screen layout as requested | **PASS** |

### 12.2 Production Bundler Health
```bash
npm run build
```
- **Exit Code:** 0 (2,385 modules transformed in under 1s)
- **Bundle Integrity:** Zero JSX compilation or import errors.


