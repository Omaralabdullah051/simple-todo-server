const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ex3wp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(cors());
app.use(express.json());

const run = async () => {
  try {
    await client.connect();
    const todoCollection = client.db("todo_management").collection("todos");

    app.post("/addtask", async (req, res) => {
      try {
        const todo = req.body;
        const result = await todoCollection.insertOne(todo);
        res.send({ success: true, result });
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/viewtask", async (req, res) => {
      try {
        const result = await todoCollection.find({}).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }

      app.put("/completetask", async (req, res) => {
        try {
          const id = req.query.id;
          const filter = { _id: ObjectId(id) };
          console.log(req.body);
          const updatedDoc = {
            $set: req.body,
          };
          const upsert = { upsert: true };
          const result = await todoCollection.updateOne(
            filter,
            updatedDoc,
            upsert
          );
          res.send({ success: true, result });
        } catch (err) {
          console.log(err);
        }
      });
    });

    app.delete("/deletetask", async (req, res) => {
      try {
        const id = req.query.id;
        const query = { _id: ObjectId(id) };
        const result = await todoCollection.deleteOne(query);
        res.send({ success: true, result });
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
run();

app.get("/", (req, res) => {
  res.send("Hello!users");
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
