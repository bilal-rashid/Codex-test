import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  console.error("Tip: export FIREBASE_PRIVATE_KEY with escaped newlines (\\n).");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const db = getFirestore();

const restaurantId = process.env.SEED_RESTAURANT_ID || "default-restaurant";
const locationId = process.env.SEED_LOCATION_ID || "default-location";
const adminUid = process.env.SEED_ADMIN_UID || "seed-admin";

async function seed() {
  const batch = db.batch();

  const locationRef = db.collection("locations").doc(locationId);
  batch.set(
    locationRef,
    {
      restaurantId,
      name: "Main Location",
      timezone: "UTC",
      isActive: true,
      createdAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  const userRef = db.collection("users").doc(adminUid);
  batch.set(
    userRef,
    {
      name: "Seed Admin",
      email: "admin@example.com",
      role: "admin",
      restaurantId,
      locationIds: [locationId],
      isActive: true,
      createdAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  const staffRef = db.collection("staff").doc("seed-staff-1");
  batch.set(
    staffRef,
    {
      name: "Seed Staff",
      username: "seed.staff",
      userId: adminUid,
      restaurantId,
      locationIds: [locationId],
      isActive: true,
      createdAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  await batch.commit();

  console.log("Firestore bootstrap complete.");
  console.log(`Restaurant: ${restaurantId}`);
  console.log(`Location doc: locations/${locationId}`);
  console.log(`User doc: users/${adminUid}`);
  console.log("Staff doc: staff/seed-staff-1");
}

seed().catch((error) => {
  console.error("Bootstrap failed:", error);
  process.exit(1);
});
