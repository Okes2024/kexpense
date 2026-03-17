# Google Play Production Checklist

## ✅ Completed

### Configuration
- [x] Android package name added (`com.expensetracker.app`)
- [x] Android version code added (1)
- [x] App name updated to "Expense Tracker"
- [x] EAS build configuration created (`eas.json`)
- [x] Production logger utility created
- [x] Critical console.log statements replaced with logger

### Code Quality
- [x] Database error handling uses logger
- [x] App initialization error handling uses logger

## ⚠️ Action Required Before Submission

### 1. EAS Project Setup
- [ ] Run `eas init` to create EAS project and get project ID
- [ ] Update `app.json` with your actual EAS project ID (replace `"your-project-id-here"`)
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to EAS: `eas login`

### 2. App Configuration
- [ ] Update Android package name if needed (currently `com.expensetracker.app`)
  - Must be unique and follow reverse domain notation
  - Cannot be changed after first release
- [ ] Update iOS bundle identifier if needed (currently `com.expensetracker.app`)
- [ ] Verify app name is appropriate for Play Store
- [ ] Add app description for Play Store listing

### 3. Assets & Icons
- [ ] Verify all required assets exist:
  - [ ] `assets/icon.png` (1024x1024px recommended)
  - [ ] `assets/adaptive-icon.png` (1024x1024px, foreground only)
  - [ ] `assets/splash-icon.png`
- [ ] Create Play Store assets:
  - [ ] Feature graphic (1024x500px)
  - [ ] Screenshots (at least 2, recommended: phone, tablet)
  - [ ] App icon (512x512px)
  - [ ] Promo video (optional but recommended)

### 4. Permissions & Privacy
- [ ] Review Android permissions in `app.json` (currently empty array - good for privacy)
- [ ] Create Privacy Policy (required for apps that collect data)
  - Since this app stores financial data locally, consider adding a privacy policy
  - Host it online and add URL to Play Store listing
- [ ] Add privacy policy URL to app if collecting any user data

### 5. Build & Testing
- [ ] Test production build locally:
  ```bash
  eas build --platform android --profile preview
  ```
- [ ] Test on physical Android device
- [ ] Test all core features:
  - [ ] Add transactions
  - [ ] View transactions
  - [ ] Delete transactions
  - [ ] Export to PDF
  - [ ] Settings and currency changes
  - [ ] Budget features
- [ ] Test app performance and memory usage
- [ ] Test on different Android versions (if possible)

### 6. Code Cleanup (Optional but Recommended)
- [ ] Replace remaining `console.error` statements in:
  - `screens/HomeScreen.tsx`
  - `screens/StatsScreen.tsx`
  - `screens/ExpensesScreen.tsx`
  - `screens/SettingsScreen.tsx`
  - `contexts/BudgetContext.tsx`
  - `contexts/CurrencyContext.tsx`
  - `utils/deobfuscate.ts`
- [ ] Consider adding error reporting service (Sentry, Crashlytics, etc.)

### 7. Google Play Console Setup
- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Create new app in Play Console
- [ ] Fill out store listing:
  - [ ] App name
  - [ ] Short description (80 chars max)
  - [ ] Full description (4000 chars max)
  - [ ] App icon
  - [ ] Feature graphic
  - [ ] Screenshots
  - [ ] Category
  - [ ] Content rating questionnaire
- [ ] Set up pricing and distribution
- [ ] Complete content rating
- [ ] Add privacy policy URL

### 8. Build Production Bundle
- [ ] Build production AAB (Android App Bundle):
  ```bash
  eas build --platform android --profile production
  ```
- [ ] Download and verify the AAB file
- [ ] Upload to Play Console (Internal Testing track first recommended)

### 9. Testing Tracks
- [ ] Upload to Internal Testing track
- [ ] Test with internal testers
- [ ] Upload to Closed Testing track (optional)
- [ ] Upload to Open Testing track (optional)
- [ ] Submit to Production track

### 10. Release Checklist
- [ ] Version number is correct (currently 1.0.0)
- [ ] Version code increments with each release (currently 1)
- [ ] All features tested and working
- [ ] No critical bugs
- [ ] Privacy policy accessible
- [ ] App complies with Google Play policies
- [ ] Content rating completed
- [ ] Store listing complete

## 📋 Build Commands

### Development Build
```bash
eas build --platform android --profile development
```

### Preview Build (APK)
```bash
eas build --platform android --profile preview
```

### Production Build (AAB)
```bash
eas build --platform android --profile production
```

### Submit to Play Store
```bash
eas submit --platform android --profile production
```

## 🔒 Security Considerations

- ✅ No sensitive data in code
- ✅ Local SQLite database (data stays on device)
- ✅ No network permissions required
- ⚠️ Consider adding data encryption for sensitive financial data (future enhancement)

## 📱 Minimum Requirements

- **Android**: API level 21 (Android 5.0) or higher
- **Storage**: Minimal (local SQLite database)
- **Permissions**: None required (fully offline app)

## 🐛 Known Issues to Address

None currently identified, but test thoroughly before submission.

## 📝 Notes

- The app uses Expo SDK 54
- React Native 0.81.5
- New Architecture enabled
- Edge-to-edge enabled for Android
- Fully offline - no internet connection required

## 🚀 Quick Start for Production Build

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Initialize project: `eas init` (if not done)
4. Update project ID in `app.json`
5. Build: `eas build --platform android --profile production`
6. Submit: `eas submit --platform android --profile production`

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Status**: Ready for testing, pending EAS setup

