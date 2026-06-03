---
name: family-app-design
description: Design spec for the MVP family collaboration app (Firebase-first approach)
metadata:
  type: reference
---

# Design Specification — Family App MVP (2026-06-03)

## 1. Architecture Overview
- **Front‑end:** Vite + React SPA, served by **Firebase Hosting** (preview channel for dev).
- **Backend / Data:** **Firebase Realtime Database** stores activities, rewards, token wallets, completion requests, and user metadata.
- **Authentication:** **Firebase Authentication** (email & Google providers). After sign‑in the user selects a role (parent | kid) stored under `/users/<uid>/role`.
- **Server‑side logic:** **Firebase Cloud Functions** (Node) enforce the token‑award workflow and reward‑redeem checks, guaranteeing atomic updates.
- **Testing:** Vitest unit tests + Firebase Emulator Suite for integration/end‑to‑end tests.

## 2. Data Model (JSON shape)
```json
{
  "users": { "<uid>": { "role": "parent|kid", "familyId": "<fid>" } },
  "families": { "<fid>": { "name": "…", "members": ["<uid>", "…"] } },
  "activities": {
    "<aid>": {
      "familyId": "<fid>",
      "title": "Read a book",
      "tokenValue": 5,
      "status": "open|inNegotiation|completed"
    }
  },
  "rewards": {
    "<rid>": {
      "familyId": "<fid>",
      "title": "Ice‑cream",
      "cost": 20,
      "status": "available|redeemed"
    }
  },
  "wallets": { "<uid>": { "balance": 12 } },
  "completionRequests": {
    "<crid>": {
      "activityId": "<aid>",
      "kidId": "<uid>",
      "status": "pending|approved|rejected",
      "timestamp": 1728000000
    }
  }
}
```

## 3. Component Layout (React)
- `App.tsx` – sets up React Router and provides Auth context.
- Routes:
  - `/dashboard` – parent or kid dashboard showing token balance & recent activity.
  - `/activities` – list/create activities (parent) and activity completion UI (kid).
  - `/rewards` – reward store UI where kids can redeem tokens.
- UI components are taken from `figma_design/src/app/components/ui` (shadcn library) and copied to `src/components/ui`.
- Shared components (e.g., `TokenBalance`, `ActivityCard`, `RewardCard`) wrap the raw shadcn pieces and add domain‑specific logic.

## 4. Auth Flow
1. User signs in via Firebase Auth UI (email + Google).
2. After sign‑in a **role selection screen** stores `role` under `/users/<uid>`.
3. The app reads the role to render the appropriate dashboard and apply route guards.

## 5. Core Workflow: Activity → Completion → Approval → Token Award
1. **Kid** selects an activity and clicks *Mark as Done* → creates a `completionRequests/<crid>` entry (`status: pending`).
2. **Parent Dashboard** shows pending requests. Clicking *Approve* calls a Cloud Function `approveCompletion` which:
   - Verifies request belongs to the same `familyId`.
   - Atomically increments the kid's `/wallets/<kidId>/balance` by the activity's `tokenValue`.
   - Updates the request status to `approved`.
3. Real‑time listeners on `/wallets/<uid>` instantly update the UI balances.

## 6. Reward Store UI
- Reads `/rewards` where `status == "available"` and displays each reward.
- When a kid clicks *Redeem*, a Cloud Function `redeemReward` checks the wallet balance, deducts the cost, marks the reward as `redeemed`, and logs the transaction.
- UI updates via realtime listeners on the wallet and rewards nodes.

## 7. Testing Strategy
- **Unit tests** with Vitest for pure React components and utility functions.
- **Integration tests** using the **Firebase Emulator Suite** (Database + Auth + Functions) to run end‑to‑end scenarios:
  - Activity creation → kid completion → parent approval → token balance update.
  - Reward redemption flow with insufficient‑balance error.
- CI workflow runs `npm test && firebase emulators:exec "npm run test:e2e"`.

## 8. Future Extension Points
- **Negotiation UI** will add a `negotiations` node and corresponding Cloud Functions; the current data model leaves room for `status: inNegotiation` on activities/rewards.
- **Growth Log** can be added as a new top‑level `/growthLogs` collection without impacting existing flows.
- **Analytics** can read from the same Realtime Database or be exported to BigQuery for deeper insights.

---

*Spec written and committed on 2026‑06‑03. Ready for review.*
