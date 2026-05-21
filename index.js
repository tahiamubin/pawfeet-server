const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("petfeet");
    const allpetCollection = db.collection("allpets");
    const listingsCollection = db.collection("listings");

    app.get("/all-pet", async (req, res) => {
      const result = await allpetCollection.find().toArray();
      res.json(result);
    });
    app.get("/all-pet/:id", async (req, res) => {
      const { id } = req.params;
      const result = await allpetCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    app.get("/listing/:userId", async (req, res) => {
      const { userId } = res.params;
      const result = await listingsCollection
        .findOne({ userId: userId })
        .toArray();
      res.json(result);
    });

    app.post("/all-pet", async (req, res) => {
      const allpetData = req.body;
      console.log(allpetData);
      const result = await allpetCollection.insertOne(allpetData);
      res.json(result);
    });

    app.post("/listing", async (req, res) => {
      const listingData = req.body;
      const result = await listingsCollection.insertOne(listingData);
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
