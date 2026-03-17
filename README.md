# kexpense - Mobile App

A fully offline expense calculator mobile app built with Expo and React Native. Track your income and expenses, view monthly summaries, and export reports to PDF.

## Features

- ✅ **Add Expenses & Income**: Easily record your financial transactions
- ✅ **Auto-Calculate Totals**: Automatic calculation of income, expenses, and balance
- ✅ **Monthly Summary**: View summaries for any month with easy navigation
- ✅ **Export to PDF**: Generate and share PDF reports of your financial data
- ✅ **Fully Offline**: All data stored locally using SQLite database
- ✅ **Beautiful UI**: Modern, clean interface with intuitive navigation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

## Usage

### Adding Transactions

1. Tap the **+** button at the bottom right
2. Select **Income** or **Expense**
3. Enter the amount
4. Optionally add a description and category
5. Set the date (defaults to today)
6. Tap **Save**

### Viewing Summary

1. Tap the **Summary** button in the header
2. View your monthly income, expenses, and balance
3. Tap **Export to PDF** to generate a PDF report

### Navigating Months

- Use the **‹** and **›** buttons to navigate between months
- The summary cards automatically update for the selected month

### Deleting Transactions

- Tap the **Delete** button on any transaction to remove it

## Technical Details

### Dependencies

- **expo-sqlite**: Local SQLite database for storing transactions
- **expo-print**: PDF generation and printing
- **expo-file-system**: File system operations
- **expo-sharing**: Share PDF files
- **@react-native-async-storage/async-storage**: Additional storage utilities

### Database Schema

The app uses SQLite with the following schema:

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,           -- 'income' or 'expense'
  amount REAL NOT NULL,
  description TEXT,
  category TEXT,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### File Structure

```
expense/
├── App.js          # Main application component
├── database.js     # Database utilities and queries
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## Features in Detail

### Auto-Calculation

- **Total Income**: Sum of all income transactions for the selected month
- **Total Expenses**: Sum of all expense transactions for the selected month
- **Balance**: Income minus expenses (automatically calculated)

### PDF Export

The PDF export includes:
- Month and year header
- Summary section (income, expenses, balance)
- Complete transaction list with:
  - Date
  - Type (Income/Expense)
  - Description
  - Category
  - Amount (color-coded)
- Generation timestamp

### Offline Storage

All data is stored locally on your device using SQLite. No internet connection is required, and your data remains private and secure.

## Development

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

This project is open source and available for personal use.

# kexpense
