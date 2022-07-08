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
  res.send(list);
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
  res.send(list);
});

app.post("/createForm", async (req, res) => {
  const Form = db.collection("Form");
  const data = req.body;
  console.log("data of User", data);
  await Form.add(data);
  res.send({ msg: "Form Add" });
});
app.put("/updateFormy/:id", async (req, res) => {
  const Form = db.collection("Form");
  const id = req.params.id;
  delete req.body.id;
  const data = req.body;
  await Form.doc(id).update(data);
  res.send({
    data: data,
  });
});
async function joinsCollectionsHandler(req, res) {
  const binsRef = await db.collection("Form").get();
  const binData = binsRef.docs.map((doc) =>  ({ id: doc.id, ...doc.data() }));
  const CategoryRef = await db.collection("Category").get();
  const CategoryData = CategoryRef.docs.map((doc) => doc.data());
  const binsInfoRef = await db.collection("Product").get();
  const binInfoData = binsInfoRef.docs.map((doc) => doc.data());

  const data = binData.map((bin) => {
    const { ProductID, CategoryID } = bin;
    const cate = CategoryData.filter((doc) => doc.CategoryID === CategoryID);
    const det = binInfoData.filter((doc) => doc.ProductID === ProductID);
    return { ...bin, det, cate };
  });
  
  res.json(data);
}
app.get("/twoColectionJoin", joinsCollectionsHandler);


async function joinsCollectionsHandler2(req, res) {
  id = req.params.id
  const binsRef = await db.collection("Form").where("__name__","==",id).get();
  const binData = binsRef.docs.map((doc) =>  ({ id: doc.id, ...doc.data() }));
  const CategoryRef = await db.collection("Category").get();
  const CategoryData = CategoryRef.docs.map((doc) => doc.data());
  const binsInfoRef = await db.collection("Product").get();
  const binInfoData = binsInfoRef.docs.map((doc) => doc.data());

  const data = binData.map((bin) => {
    const { ProductID, CategoryID } = bin;
    const cate = CategoryData.filter((doc) => doc.CategoryID === CategoryID);
    const det = binInfoData.filter((doc) => doc.ProductID === ProductID);
    return { ...bin, det, cate };
  });
  
  res.json(data);
}
app.get("/twoColectionJoin2/:id", joinsCollectionsHandler2);

app.get("/getProduct2", async (req,res) => {
let type = req.body.type
let Name =req.body.Name
  if(req.body.type != null){
    let commentsQuery = await db.collection("Form").where("ProductID", "==", type).get()
    let mapping = commentsQuery.docs.map((doc)=> doc.data())
    res.send(mapping);
  }
  if(req.body.Name != null){
    let commentsQuery = await db.collection("Form").where("Name", "==", Name).get()
    let mapping = commentsQuery.docs.map((doc)=> doc.data())
    res.send(mapping);
  }

});

app.delete("/deleteForm/:id", async (req, res) => {
  const Form = db.collection("Form");
  const id = req.params.id;
  await Form.doc(id).delete();
  res.send({
    data: "Delted",
  });
});



app.get("/csv", async (err, results) => {
  const XLSX = require("xlsx");
  const binsRef = await db.collection("Form").get();
  const binData = binsRef.docs.map((doc) => doc.data());
  const CategoryRef = await db.collection("Category").get();
  const CategoryData = CategoryRef.docs.map((doc) => doc.data());
  const binsInfoRef = await db.collection("Product").get();
  const binInfoData = binsInfoRef.docs.map((doc) => doc.data());
  const data = binData.map((bin) => {
    const { ProductID, CategoryID } = bin;
    const cate = CategoryData.filter((doc) => doc.CategoryID === CategoryID);
    const det = binInfoData.filter((doc) => doc.ProductID === ProductID);
    return { ...bin, det, cate };
  });  
  data2 = [];
  
  for (let i = 0; i < data.length; i++) {
 
  
    console.log(data[i].det[0]['ProductName'])
    const students = [
      { CategoryID: data[i].CategoryID, ProductID: data[i].ProductID, 
        ProductName: data[i].det[0]['ProductName'],Adress:data[i].det[0]['Adress'],Price:data[i].det[0]['Price'] ,
        sqm:data[i].det[0]['sqm'],bedroom:data[i].det[0]['bedroom'],bathroom:data[i].det[0]['bathroom'],
        Parking:data[i].det[0]['Parking'],Postdate:data[i].date,bathroom:data[i].det[0]['Price'],
        Name:data[i].Name,Tel:data[i].Tel,Consent:data[i].Consent,
        Status:data[i].Status,Remark:data[i].Remark,update:data[i].update,

      
      },
    ];

    if(data[i].update === null) data.update === "ยังไม่มีการอัพเดท"
    data2.push(...students);
  }
  console.log(data2)
  const convertJsonToexcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(data2);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "HouseData");
    //binary buffer
    XLSX.write(workBook, {
      bookType: "xlsx",
      type: "buffer",
    });
    //binary string
    const fs = require('fs');
    const filename = "users.xlsx";
    const wb_opts = {bookType: 'xlsx', type: 'binary'};   // workbook options
    XLSX.writeFile(workBook, filename, wb_opts);                // write workbook file
    const stream = fs.createReadStream(filename);         // create read stream
    stream.on('open', function () {
      // This just pipes the read stream to the response object (which goes to the client)
      stream.pipe(results)
     
    });

  
  };
  convertJsonToexcel();
  
});

var port_number = app.listen(process.env.PORT || 4000);
app.listen(port_number);

