<!-- 8d1760c2-ba53-429a-a19f-406ec472ba07 8ff9f2ef-810a-4e9c-993f-7974d29afbdc -->
# Integrate Knot SDK for Real Account Linking

## Current State

- ✅ Visual representation (Knot logo/badge) - Already have
- ✅ SKU data extraction and display - Already have  
- ✅ Direct API calls to Knot Transaction Sync API - Already have
- ❌ Real SDK integration - Currently simulated with setTimeout

## Goal

Implement the Knot SDK for real account linking to qualify for bonus points in the Knot hackathon track.

## Implementation Steps

### 1. Install Knot SDK Package

- Add Knot SDK to `package.json`
- Package name: `@knotapi/knotapi` (or check Knot docs for exact package name)
- Run `npm install`

### 2. Update API Route Configuration

- File: `app/api/knot-transactions/route.ts`
- Switch from tunnel endpoint to development endpoint: `https://development.knotapi.com/transactions/sync`
- Update credentials to use dev secret: `ff5e51b6dcf84a829898d37449cbc47a`
- Keep Basic Auth format but update secret

### 3. Create Knot SDK Initialization

- File: `lib/knot.ts` (new file)
- Initialize Knot SDK with clientId: `dda0778d-9486-47f8-bd80-6f2512f9bcdb`
- Export SDK instance and helper functions

### 4. Replace Simulated Connection with Real SDK

- File: `components/SpendingTracker.tsx`
- Replace `handleConnectKnot()` function:
  - Import Knot SDK
  - Call `linkAccount()` method to open Knot UI modal
  - Handle `onSuccess` callback to receive `merchant_id`
  - Store `merchant_id` in state/localStorage
  - Use real `merchant_id` for transaction sync
  - Handle `onError` callback for error states

### 5. Update Transaction Fetching

- File: `components/SpendingTracker.tsx`
- Update `fetchTransactions()` to use stored `merchant_id` from SDK callback
- Remove hardcoded `merchant_id: 44`
- Use user-specific `merchant_id` from account linking

### 6. Add Session Creation (if needed)

- File: `app/api/knot-session/route.ts` (new file, if SDK requires session)
- Create session endpoint using: `https://development.knotapi.com/session/create`
- Use dev credentials for session creation

### 7. Environment Variables

- File: `.env.local` (create/update)
- Add:
  ```
  KNOT_CLIENT_ID=dda0778d-9486-47f8-bd80-6f2512f9bcdb
  KNOT_SECRET=ff5e51b6dcf84a829898d37449cbc47a
  KNOT_ENV=development
  ```


### 8. Update Transactions Page

- File: `app/transactions/page.tsx`
- Use same SDK integration pattern
- Store merchant_id per user
- Fetch transactions using linked merchant_id

### 9. Error Handling & UX

- Add loading states during SDK modal
- Show connection status clearly
- Handle SDK errors gracefully
- Display which merchant is connected

### 10. Testing

- Test with development environment
- Verify SDK modal opens correctly
- Test account linking flow
- Verify transactions sync with real merchant_id
- Test SKU data extraction from dev environment

## Files to Modify

1. `package.json` - Add Knot SDK dependency
2. `app/api/knot-transactions/route.ts` - Update to dev environment
3. `components/SpendingTracker.tsx` - Replace simulated connection with real SDK
4. `app/transactions/page.tsx` - Add SDK integration
5. `lib/knot.ts` - New file for SDK initialization
6. `.env.local` - Add Knot credentials (optional, can hardcode for hackathon)

## Notes

- Use development environment (`development.knotapi.com`) as recommended
- SDK will open a modal for account linking (may need domain allowlisting)
- Store merchant_id after successful linking
- Keep fallback to mock data if SDK/API fails
- Ensure SKU data is prominently displayed (already done)

## Hackathon Requirements Met

- ✅ Visual representation (Knot logo) - Already have
- ✅ SKU data usage - Already have
- ✅ SDK implementation - Will be added
- ✅ Dev environment data - Will use dev endpoint

### To-dos

- [ ] Install Knot SDK package (@knotapi/knotapi or check docs for exact name)
- [ ] Update knot-transactions route to use development.knotapi.com with new dev secret
- [ ] Create lib/knot.ts for SDK initialization and configuration
- [ ] Replace handleConnectKnot() in SpendingTracker.tsx with real SDK linkAccount() call
- [ ] Update fetchTransactions() to use merchant_id from SDK callback instead of hardcoded value
- [ ] Create /api/knot-session route if SDK requires session creation first
- [ ] Add SDK integration to transactions page for account linking
- [ ] Add proper error handling and UX improvements for SDK connection flow