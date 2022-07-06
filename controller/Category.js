const auth = require("../config");
const db = auth.firestore();
const User = db.collection("1");
exports.createCategory = async (req, res) => {
    const data = req.body;
    console.log("data of User", data);
    await User.add(data);
    res.send({ msg: "User Add" });
}