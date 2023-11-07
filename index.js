const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const serviceBookingCollection=client.db("HomeDB").collection('bookings')


    // service method
    app.get('/service',async(req,res)=>{
      const cursor = homeServiceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/service/:id", async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id:new ObjectId(id) };
      const result = await homeServiceCollection.findOne(query);
      console.log(result)
      res.send(result)
    })


      app.post('/service',async(req,res)=>{
        const addService=req.body;
        console.log(addService);
        const result = await homeServiceCollection.insertOne(addService);
        res.send(result)
      });

      
      app.delete('/service', async (req, res) => {
        const service = req.body;
        // console.log(service);
        const query = { prodId: service.id };
        const filter = {
            $and: [
                { email: service.email },
                {id: service.id } ]
        }
        const result = await homeServiceCollection.deleteOne(filter);
        res.send(result);
    })
  


     // booking method
      
      app.post('/booking',async(req,res)=>{
        const addBooking=req.body;
        console.log(addBooking);
        const result = await serviceBookingCollection.insertOne(addBooking);
        res.send(result)
      })

      app.get('/booking',async(req,res)=>{
        const cursor = serviceBookingCollection.find();
        const result = await cursor.toArray();
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