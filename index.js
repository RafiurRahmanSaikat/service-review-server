const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// middle wares
app.use(cors());
app.use(express.json());

// m56JQsWVfjeVllcW
// MyPhotography
const uri =
  "mongodb+srv://MyPhotography:m56JQsWVfjeVllcW@cluster0.8thupxf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const DbConnect = async () => {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.error(error);
  }
};
DbConnect();

const Service = client.db("MyPhotography").collection("PhotographyCategory");

const Review = client.db("MyPhotography").collection("review");

app.get("/", async (req, res) => {
  const LimitData = +req.query.data;
  if (LimitData) {
    try {
      const cursor = Service.find({}).sort({ submit: -1 }).limit(LimitData);
      const result = await cursor.toArray();
      res.send({ result, LimitData });
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const cursor = Service.find({}).sort({ submit: -1 });
      const result = await cursor.toArray();
      res.send({ result, LimitData });
    } catch (error) {
      console.error(error);
    }
  }
});
app.get("/services", async (req, res) => {
  const ID = req.query.id;
  const query = { _id: ObjectId(ID) };
  const result = await Service.findOne(query);
  res.send({ result });
});
app.get("/review", async (req, res) => {
  const ID = req.query.id;
  const query = {
    CatName: ID,
  };
  const data = Review.find(query).sort({ submit: -1 });
  const result = await data.toArray();
  res.send({ result });
});
app.get("/userreview", async (req, res) => {
  const Email = req.query.email;
  const query = {
    email: Email,
  };
  const data = Review.find(query).sort({ submit: -1 });
  const result = await data.toArray();
  res.send({ result });
});

//....... ..................DELETE start................

app.delete("/delete", async (req, res) => {
  const id = req.query.id;
  console.log(id);
  const result = await Review.deleteOne({ _id: ObjectId(id) });

  if (result.deletedCount) {
    res.send({
      success: true,
      message: `Successfully Deleted `,
    });
  } else {
    res.send({
      success: true,
      message: `Failed to Delete`,
    });
  }
});

// .........................DELETE end............................

// ................Patch  Req Start...........

app.patch("/update/", async (req, res) => {
  const id = req.query.id;
  const UpdateData = req.body;
  console.log("id", id, "DATA", UpdateData);
  const result = await Review.updateOne(
    { _id: ObjectId(id) },
    { $set: req.body }
  );
  if (result.matchedCount) {
    res.send({
      success: true,
      message: `successfully updated `,
    });
  } else {
    res.send({
      success: false,
      error: "Couldn't update  the product",
    });
  }
  //
});

// ................Patch  Req End...........

// ,............................................POST REQ Start..........................

app.post("/addreview", async (req, res) => {
  try {
    const result = await Review.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully Added  with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't Added",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ,............................................POST REQ End..........................

// ..............................NEW Service ADD Start ..........

app.post("/addNewService", async (req, res) => {
  try {
    const result = await Service.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully Added  with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't Added",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ..............................NEW Service ADD End ..........

app.listen(port, (req, res) => {
  console.log("OK server is running", port);
});