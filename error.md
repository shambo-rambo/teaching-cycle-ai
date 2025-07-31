# OAuth Authentication Error Resolution Log

## Current Status: Day 2 - Session 2

### Original Errors Encountered:
```
client:345 Cross-Origin-Opener-Policy policy would block the window.postMessage call.
index-b5ad90ed.js:67 POST https://teaching-cycle-backend-531124404080.us-central1.run.app/api/auth/google 401 (Unauthorized)
Unchecked runtime.lastError: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

### Root Cause Analysis:
1. **CORS Policy Mismatch**: Frontend firebase.json sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` but backend returns `cross-origin-opener-policy: same-origin`
2. **Missing Backend Route**: `/api/auth/google` returns 404 - route doesn't exist on backend
3. **Hardcoded Client IDs**: Multiple inconsistent Google OAuth client IDs found in codebase

### Actions Taken This Session:

#### ✅ Hardcoded ID Cleanup:
- **Found hardcoded IDs**:
  - `531124404080-uk3pq4aajr0p4u7vifuer18ab2cuol1p` (old/incorrect)
  - `708925310405-81ev12htr3c4neq6nan9abkm3oeisn0s` (current/correct)

- **Files Updated**:
  - `test-login.html:12` - Fixed client ID to use correct one
  - `frontend/src/contexts/AuthContext.jsx:31,62,97,130,157` - Removed hardcoded fallback URLs, now uses `window.APP_CONFIG.API_BASE_URL` exclusively

#### ✅ Configuration Verification:
- **Current Config** (`frontend/public/config.js`):
  ```js
  GOOGLE_CLIENT_ID: '708925310405-81ev12htr3c4neq6nan9abkm3oeisn0s.apps.googleusercontent.com'
  API_BASE_URL: 'https://teaching-cycle-backend-531124404080.us-central1.run.app'
  ```

- **Frontend Build**: ✅ Successful (no errors)
- **Backend Status**: ❌ `/api/auth/google` still returns 404

### Current Issues Remaining:
1. **Backend Missing Route**: `/api/auth/google` endpoint doesn't exist (404)
2. **CORS Policy Mismatch**: Frontend allows popups, backend enforces same-origin
3. **Backend CORS Headers**: Need to allow learning-cycle-v2.web.app domain

### Next Session Instructions:
1. **Fix Backend Route**: Implement `/api/auth/google` POST endpoint
2. **Fix Backend CORS**: 
   - Change `cross-origin-opener-policy` to `same-origin-allow-popups`
   - Add `Access-Control-Allow-Origin: https://learning-cycle-v2.web.app`
   - Add `Access-Control-Allow-Credentials: true`
3. **Test OAuth Flow**: After backend fixes, test complete authentication flow

### Files Modified This Session:
- `test-login.html` - Updated Google client ID
- `frontend/src/contexts/AuthContext.jsx` - Removed hardcoded fallback URLs
- `error.md` - Created this log (NEW)

### Commands for Next Session:
```bash
# Check backend auth endpoint
curl -I https://teaching-cycle-backend-531124404080.us-central1.run.app/api/auth/google

# Test frontend build
cd frontend && npm run build

# Deploy and test
firebase deploy --only hosting
```

### Session 2 Continuation - Additional Findings:

#### ✅ Backend Investigation Results:
- **Backend Route**: `/api/auth/google` **EXISTS** and is working (returns proper 401 for invalid tokens)
- **CORS Configuration**: Backend properly configured for `learning-cycle-v2.web.app` domain
- **Authentication System**: Full OAuth implementation found in backend codebase

#### ✅ Root Cause Identified - CORS Policy Mismatch:
- **Frontend**: `Cross-Origin-Opener-Policy: same-origin-allow-popups` ✅
- **Backend**: `Cross-Origin-Opener-Policy: same-origin` ❌

#### Backend Helmet Configuration Issue:
The backend uses default `helmet()` middleware which enforces `same-origin` policy, blocking OAuth popup communication. This is the **primary cause** of the `Cross-Origin-Opener-Policy policy would block the window.postMessage call` error.

#### ✅ Actions Taken Session 2:
- Fixed remaining hardcoded client IDs in test-login.html
- Removed fallback URLs from AuthContext.jsx (now uses config exclusively)  
- Verified backend auth endpoint exists and responds correctly
- Confirmed CORS domain allowlist includes learning-cycle-v2.web.app
- Deployed frontend with correct configuration

#### 🔧 **SOLUTION REQUIRED**:
Backend `app.js:24` needs helmet configuration change:
```javascript
// Current (blocking popups):
app.use(helmet());

// Required (allow popups):
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
```

### Updated Next Steps:
1. **Backend Deployment**: Update helmet configuration to allow OAuth popups
2. **Test Complete Flow**: OAuth should work after backend update
3. **Frontend Ready**: All frontend configuration is correct

### Key Insight:
The issue is NOT missing backend routes or frontend config - it's a **security header mismatch** preventing OAuth popup communication. Backend helmet middleware needs reconfiguration to allow popups.