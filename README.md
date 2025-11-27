# PayRipple

A mobile payment application built using Expo (React Native). The project demonstrates the fundamentals of building a modern UPI-style app similar to PhonePe or Google Pay, including authentication, navigation, state management, secure storage, and modular architecture.

---

## Features

* Authentication flow using Redux Toolkit and SecureStore
* Multiple navigators: stack, tabs, and nested navigation
* Modular folder structure for scalable development
* Reusable UI components
* API service layer using Axios
* Local storage using AsyncStorage
* Secure credential storage
* Ready for integration with backend or third-party payment APIs

---

## Tech Stack

* Expo
* React Native
* TypeScript
* React Navigation
* Redux Toolkit
* Axios
* AsyncStorage
* Expo SecureStore

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/krishpranav/PayRipple.git
cd PayRipple
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
expo start
```

4. Run on a device or simulator via Expo Go or Expo Dev Tools.

---

## Project Structure

```
src
 ├── components
 ├── navigation
 ├── screens
 ├── services
 ├── store
 ├── hooks
 ├── utils
 ├── constants
 └── types
```

---

## Navigation Structure

* RootNavigator
  Handles switching between Auth flow and Main app.

* AuthNavigator
  Login and onboarding screens.

* MainNavigator
  Bottom tab navigation for Home, Transactions, Profile, etc.

---

## State Management

Redux Toolkit is used to manage global state:

* Authentication
* User profile
* Transaction data
* App configuration

Store file is located at:

```
src/store/store.ts
```

---

## Secure Storage

Sensitive data (tokens, session keys) are stored using:

```
expo-secure-store
```

---

## API Layer

All API requests are handled using Axios, organized under:

```
src/services/
```

Supports custom headers, interceptors, and token injection.

---

## Scripts

Start the app:

```bash
expo start
```

Run TypeScript type checking:

```bash
npm run tsc
```

Clear Expo cache:

```bash
expo start -c
```

---

## Requirements

* Node.js 18+
* npm or yarn
* Expo CLI
* Xcode (for iOS) or Android Studio (for Android)

---

## Future Improvements

* Real UPI backend integration
* QR code payments
* Transaction history sync
* Push notifications
* Wallet and rewards module

---

## License

This project is licensed under the MIT License.

---