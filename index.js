const express = require("express");
const cors = require("cors");

const auth = require("./config");
const app = express();
app.use(express.json());
app.use(cors());

const db = auth.firestore();
const User = db.collection("Category");


app.get("/getCategory/:id", async (req, res) => {
  const snapshot = await User.get();
  const id = snapshot.docs.map((doc) => doc.id);
  res.send(id);
});

app.get("/getCategory", async (req, res) => {
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list)
});

app.get("/getCategory", async (req, res) => {
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list)
});

app.post("/createCategory", async (req, res) => {
  const data = req.body;
  console.log("data of User", data);
  await User.add(data);
  res.send({ msg: "User Add" });
});
app.post("/updateCategory/:id", async (req, res) => {
  const id = req.params.id;
  delete req.body.id;
  const data = req.body;
  await User.doc(id).update(data);
  res.send({
    data: data,
  });
});


app.post("/createProduct", async (req, res) => {
  const Product = db.collection("Product");
  const data = req.body;
  console.log("data of User", data);
  await Product.add(data);
  res.send({ msg: "Product Add" });
});
app.get("/getProduct", async (req, res) => {
  const Product = db.collection("Product");
  const snapshot = await Product.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list)
});

app.post("/createForm", async (req, res) => {
  const Form = db.collection("Form");
  const data = req.body;
  console.log("data of User", data);
  await Form.add(data);
  res.send({ msg: "Form Add" });
});

async function joinsCollectionsHandler(req, res) {
  const binsRef = await db.collection("Form").get();
  const binData = binsRef.docs.map(doc => doc.data());
  const CategoryRef = await db.collection("Category").get();
  const CategoryData = CategoryRef.docs.map(doc => doc.data());
  const binsInfoRef = await db.collection("Product").get();
  const binInfoData = binsInfoRef.docs.map(doc => doc.data());
  console.log(binData)
  
  const data = binData.map(bin => {
   
    const { ProductID ,CategoryID} = bin;
    const cate = CategoryData.filter(

      doc => doc.CategoryID === CategoryID
    );
    const det = binInfoData.filter(

      doc => doc.ProductID === ProductID
    );
    return { ...bin, det,cate };
  });
 
  res.json(data);
}
app.get("/twoColectionJoin", joinsCollectionsHandler);


app.get("/getForm/:ProductID", async (req, res) => {
  const Form = db.collection("Form");
  const snapshot = await Form.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const ProductID = req.params.ProductID;
  const prodict = await db.collection("Product").where('ProductID',"==",ProductID)
  const data = await prodict.get();
  if(!data.exists){
    res.status(404).send('failed')
  }else{
    res.send(data.data())
  }
});

app.post("/deleteCategory", async (req, res) => {
  const id = req.body.id;
  await User.doc(id).delete();
  res.send({
    data: "Delted",
  });
});


app.post("/csv", async (req, res) => {
  const XLSX = require("xlsx");
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  data = [];
  for (let i = 0; i < list.length; i++) {
    const students = [
      { Collage: list[i].Collage, name: list[i].name, stu: list[i].stu },
    ];
    data.push(...students);
  }
  const convertJsonToexcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "students");
    //binary buffer
    XLSX.write(workBook, {
      bookType: "xlsx",
      type: "buffer",
    });
    //binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    const excel = XLSX.writeFile(workBook, "studentsdata.xlsx");
    res.send(excel);
  };
  convertJsonToexcel();
  

});

app.listen(4000, () => console.log("Up & Running *4000"));
