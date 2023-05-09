const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://Ibrahim:123@ibrahim.a2p60n2.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.Port || 5000
//this is my midleware
app.use(cors())
app.use(express.json())


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
        const usersCollection = client.db("userDB").collection("users");

        await client.connect();

        app.get('/user', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const results = await usersCollection.insertOne(user)
            res.send(results)
            console.log('server', results);
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)

        }
        )


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Simple Cruad Function')
})


app.listen(port, () => {
    console.log(`${port} running `);
})