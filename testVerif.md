# Test Verification Guide (LibraryManagement)

## What was implemented

### Backend tests (Library microservice)

#### Unit tests (JUnit 5 + Mockito)
- `backend\microservices\Library\src\test\java\com\esprit\microservice\library\service\BorrowingPolicyServiceImplTest.java`
  - Borrow eligibility rules (quota, unpaid fines, restricted resource type, stock checks, role fallback).
- `backend\microservices\Library\src\test\java\com\esprit\microservice\library\service\LoanServiceImplTest.java`
  - Borrow/return workflows, fine payment, overdue/reminder logic, failure scenarios.
- `backend\microservices\Library\src\test\java\com\esprit\microservice\library\service\InventoryAnalyticsServiceImplTest.java`
  - Analytics/report mapping logic and edge defaults.

#### Integration tests (`@SpringBootTest` + `MockMvc`)
- `backend\microservices\Library\src\test\java\com\esprit\microservice\library\integration\LoanControllerIntegrationTest.java`
  - Critical endpoints and full flow (borrow -> return), auth requirements, policy-violation response handling.
- `backend\microservices\Library\src\test\java\com\esprit\microservice\library\integration\BorrowingPolicyControllerIntegrationTest.java`
  - Policy retrieval/update flow and invalid payload handling.

---

### Frontend tests (Karma + Jasmine)

#### Service specs
- `frontend\src\app\core\services\loan.service.spec.ts`
- `frontend\src\app\core\services\cart.service.spec.ts`
- `frontend\src\app\core\services\library.service.spec.ts`

Covered: request methods/URLs/params, data mapping, and HTTP error propagation.

#### Component specs
- `frontend\src\app\front-office\library\library.component.spec.ts`
  - UI/business behavior: filtering, conditional rendering, blocked invalid borrow actions, checkout and notification side-effects, API failure handling.
- `frontend\src\app\back-office\borrowing-policies\borrowing-policies.component.spec.ts`
  - Load/save flows, toggle restriction logic, access/offline error mapping, success/failure UI states.

---

## How to run and verify

## 1) Backend (Library microservice)

From repository root:

```bash
cd backend\microservices\Library
mvn test
```

To run only new test classes:

```bash
mvn -Dtest=BorrowingPolicyServiceImplTest,LoanServiceImplTest,InventoryAnalyticsServiceImplTest,LoanControllerIntegrationTest,BorrowingPolicyControllerIntegrationTest test
```

Expected verification:
- Build succeeds.
- Tests pass.
- Integration tests validate status codes and response payloads for critical workflows.

## 2) Frontend (Angular)

From repository root:

```bash
cd frontend
npm install
npm test -- --watch=false --browsers=ChromeHeadless
```

To focus on newly added Library specs:

```bash
npm test -- --watch=false --browsers=ChromeHeadless --include src/app/core/services/loan.service.spec.ts --include src/app/core/services/cart.service.spec.ts --include src/app/core/services/library.service.spec.ts --include src/app/front-office/library/library.component.spec.ts --include src/app/back-office/borrowing-policies/borrowing-policies.component.spec.ts
```

Expected verification:
- Karma/Jasmine runs complete successfully.
- Library component/service and policy component scenarios pass (including failure/edge cases).

---

## Note
In my execution environment, local runtime verification was blocked because `pwsh.exe` was unavailable, so please run the commands above on your machine to validate end-to-end.

