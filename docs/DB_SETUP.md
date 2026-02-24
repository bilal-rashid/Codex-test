# Database setup (Firestore)

This app uses **Firebase Auth + Firestore**.

## 1) Configure app environment

1. Copy `.env.example` to `.env.local`.
2. Fill all `NEXT_PUBLIC_FIREBASE_*` values from Firebase project settings.

## 2) Create base data (collections + fields)

Firestore does not require pre-creating collections/fields like SQL tables. A collection is created automatically when a document is written.

Use the seed script to create starter docs for:
- `locations`
- `users`
- `staff`

### Required admin SDK credentials

Export these before running the script:

```bash
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Optional overrides:

```bash
export SEED_RESTAURANT_ID="default-restaurant"
export SEED_LOCATION_ID="default-location"
export SEED_ADMIN_UID="seed-admin"
```

Run:

```bash
npm run db:bootstrap
```

## 3) Why "Failed to load locations" can happen

Common causes:
- Firestore read permissions deny access.
- Missing Firestore config/env values.
- No `locations` documents for the logged-in restaurant.

This project now queries by `restaurantId` only and filters `isActive` in app code, which avoids composite index requirements for the locations/staff list pages.

## 4) User creation note

`AuthContext` reads the user profile from `users/{firebaseAuthUid}`.
If you sign in with Firebase Auth, ensure that a profile doc exists at that exact UID.
