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

  const ID = req.query.id;

  

  const query = { _id: ObjectId(ID) };

  const result = await Service.findOne(query);

  res.send({result});

  console.log(ID, query);


});

app.listen(port, (req, res) => {
  console.log("OK server is running", port);
});
