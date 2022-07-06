var admin = require("firebase-admin");

var serviceAccount = require("./app-house-c38f2-12f9a692a25e.json");

const auth = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
module.exports = auth
