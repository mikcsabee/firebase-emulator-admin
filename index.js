const admin = require("firebase-admin");

console.log(
  "FIREBASE_DATABASE_EMULATOR_HOST",
  process.env.FIREBASE_DATABASE_EMULATOR_HOST
);
console.log("FIRESTORE_EMULATOR_HOST", process.env.FIRESTORE_EMULATOR_HOST);
console.log("GCLOUD_PROJECT", process.env.GCLOUD_PROJECT);

const databaseURL = `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`;

console.log("databaseURL: ", databaseURL);

admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT,
  databaseURL,
});

const db = admin.database();

function getConfig() {
  return new Promise((resolve, reject) => {
    const ref = db.ref("config");
    ref
      .once(
        "value",
        (snapshot) => {
          resolve(snapshot.val());
        },
        (error) => {
          console.error("error -1-", error);
          reject(error);
        }
      )
      .catch((error) => {
        console.error("error -2-", error);
        reject(error);
      });

    setTimeout(() => reject("Timeout"), 30_000);
  });
}

console.log("try to fetch config...");

getConfig()
  .then((value) => {
    console.log("value", value);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
