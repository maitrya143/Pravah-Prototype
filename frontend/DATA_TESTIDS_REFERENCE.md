# Data Test IDs Reference Guide

This document lists all required `data-testid` attributes for Cypress E2E tests.

## 🔍 How to Add Test IDs

Add `data-testid` attribute to your React components:

```tsx
<button data-testid="login-submit">Login</button>
<input data-testid="admission-name" type="text" />
```

## 📋 Complete List

### Authentication Pages

#### Login Page (`src/pages/Login.tsx`)
```tsx
<Link to="/signup" data-testid="signup-link">Sign up</Link>
<input data-testid="login-volunteer_id" type="text" />
<input data-testid="login-password" type="password" />
<button data-testid="login-submit" type="submit">Login</button>
```

#### Signup Page (`src/pages/Signup.tsx`)
```tsx
<input data-testid="signup-volunteer_id" type="text" />
<input data-testid="signup-full_name" type="text" />
<input data-testid="signup-password" type="password" />
<input data-testid="signup-confirm-password" type="password" />
<button data-testid="signup-submit" type="submit">Sign Up</button>
```

### Center Selection (`src/pages/CenterSelection.tsx`)
```tsx
<div data-testid="center-card">
  <button data-testid="center-select-button">Select Center</button>
</div>
```

### Navigation (Sidebar)

Add to `src/layouts/SidebarLayout.tsx`:
```tsx
<Link to="/new-admission" data-testid="nav-new-admission">
<Link to="/manual-attendance" data-testid="nav-manual-attendance">
<Link to="/qr-scan" data-testid="nav-qr-scan">
<Link to="/diary" data-testid="nav-diary">
<Link to="/syllabus" data-testid="nav-syllabus">
```

### New Admission (`src/pages/NewAdmission.tsx`)
```tsx
<input data-testid="admission-name" />
<input data-testid="admission-date_of_birth" type="date" />
<input data-testid="admission-parent_name" />
<input data-testid="admission-contact_number" />
<input data-testid="admission-address" />
<input data-testid="admission-class" />
<button data-testid="admission-submit">Submit</button>
```

### Manual Attendance (`src/pages/ManualAttendance.tsx`)
```tsx
<input data-testid="attendance-date" type="date" />
<div data-testid="student-row">
  <input data-testid="present-checkbox" type="checkbox" />
</div>
<button data-testid="save-attendance">Save Attendance</button>
```

### QR Scan (`src/pages/QRScan.tsx`)
```tsx
<button data-testid="qr-scan-button">Start Scanning</button>
<div data-testid="qr-result">Scan Result</div>
```

## ✅ Quick Checklist

Copy this checklist and mark as you add test IDs:

- [ ] Login page - all inputs and buttons
- [ ] Signup page - all inputs and buttons
- [ ] Center selection - cards and buttons
- [ ] Navigation links - all sidebar links
- [ ] New admission - all form fields
- [ ] Manual attendance - date picker, student rows, checkboxes
- [ ] QR scan - scan button and result display

## 🧪 Testing

After adding test IDs:

1. Run `npm run start:mock`
2. Open Cypress: `npm run cypress:open`
3. Run tests to verify selectors work

