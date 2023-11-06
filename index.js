const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mctvfu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const homeServiceCollection=client.db("HomeDB").collection('services')

    app.get('/service',async(req,res)=>{
      const cursor = homeServiceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

      app.post('/service',async(req,res)=>{
        const addService=req.body;
        console.log(addService);
        const result = await homeServiceCollection.insertOne(addService);
        res.send(result)
      })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('Home Service Exchange is running')
})

app.listen(port,()=>{
    console.log(`Home Exchange port : ${port}`)
})