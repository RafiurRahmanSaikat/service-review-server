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
// const uri = "mongodb://0.0.0.0:27017/";
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
      const cursor = Service.find({}).limit(LimitData);
      const result = await cursor.toArray();
      res.send({ result, LimitData });
      console.log("WOW ", LimitData);
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const cursor = Service.find({});
      const result = await cursor.toArray();
      res.send({ result, LimitData });
      console.log("WOW ", LimitData);
    } catch (error) {
      console.error(error);
    }
  }
});
app.get("/services", async (req, res) => {
  const Email = req.query.id;
  const query = { _id: ObjectId(Email) };
  const result = await Service.findOne(query);
  res.send({ result });
  console.log(Email, query);
});
app.get("/review", async (req, res) => {
  const ID = req.query.id;
  const query = {
    CatName: ID,
  };
  const data = Review.find(query).sort({ submit: -1 });
  const result = await data.toArray();
  res.send({ result });
  console.log(ID, query);
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
// ..................DELETE start

app.delete("/delete", async (req, res) => {
  console.log("HITTING API DELETE");
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
    })
  }
});

// .........................DELETE end
//




// ,..............................................................POST REQ


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

app.listen(port, (req, res) => {
  console.log("OK server is running", port);
});
