# 🚀 Quick Start - MSW Mock Backend

## Windows PowerShell Commands

### 1. Install Dev Dependencies

```powershell
cd frontend
npm install
```

This installs:
- `msw` (Mock Service Worker)
- `cypress` (E2E testing)
- `cross-env` (environment variables)

### 2. Start Frontend with Mocks

```powershell
npm run start:mock
```

**What this does:**
- Sets `VITE_USE_MOCK=true`
- Starts Vite dev server
- Enables MSW worker automatically
- Opens at `http://localhost:5173` (or next available port)

**Verify it's working:**
- Open browser console (F12)
- Look for: `🔶 MSW Mock Service Worker started`
- Network tab shows "mock" status for `/api/*` requests

### 3. Run Cypress Tests

**Option A: GUI Mode (Interactive)**
```powershell
npm run cypress:open
```

**Option B: Headless Mode (CI/CD)**
```powershell
npm run cypress:run
```

### 4. Test Login

Use mock credentials:
- **Volunteer ID**: `25MDA177`
- **Password**: `password123` (or any password - mocks don't validate)

---

## 📝 Environment Variables

### Enable Mocks (Default in dev)

**Method 1: npm script**
```powershell
npm run start:mock
```

**Method 2: Environment variable**
```powershell
$env:VITE_USE_MOCK="true"; npm run dev
```

**Method 3: .env.local file**
Create `frontend/.env.local`:
```env
VITE_USE_MOCK=true
```

### Disable Mocks (Use Real Backend)

```powershell
$env:VITE_USE_MOCK="false"; npm run dev
```

Or set in `.env.local`:
```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Verification Checklist

After running `npm run start:mock`:

- [ ] Browser opens to `http://localhost:5173`
- [ ] Console shows: `🔶 MSW Mock Service Worker started`
- [ ] Can navigate to `/login` page
- [ ] Can sign up new volunteer
- [ ] Can login with credentials
- [ ] Can select center
- [ ] Dashboard loads with statistics

---

## 🧪 Test Flow

1. **Signup**: Create account with Volunteer ID `25MDA177`
2. **Login**: Use same credentials
3. **Center Select**: Choose a center (Mouda or Nagpur)
4. **Dashboard**: View statistics
5. **New Admission**: Add a student
6. **Manual Attendance**: Mark attendance
7. **QR Scan**: Test QR code scanning

---

## 🐛 Troubleshooting

**MSW not starting?**
```powershell
# Clear cache and restart
Remove-Item -Recurse -Force node_modules\.vite
npm run start:mock
```

**Port already in use?**
- Vite will automatically use next available port
- Check terminal output for actual port

**Tests failing?**
- Ensure dev server is running first
- Check Cypress baseUrl matches Vite port
- Verify all data-testid attributes added

---

**Ready to test! 🎉**

