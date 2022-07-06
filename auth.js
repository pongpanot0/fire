var admin = require("firebase-admin");

var serviceAccount = require("./reactra-dae73-529792b0faf1.json");

const auth = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
module.exports = auth
