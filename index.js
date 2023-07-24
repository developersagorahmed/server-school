const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo db code
const uri =
	"mongodb+srv://school-server:MA6JrXE7K0qkv1Bw@cluster0.7is7xhq.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

		const allCollage = client.db("collage").collection("allCollage");
		const bookedCollage = client.db("collage").collection("bookedCollage");
		const collageFeedback = client.db("collage").collection("feedback");
		const collageUser = client.db("collage").collection("user");

		app.get("/allClass", async (req, res) => {
			const result = await allCollage.find().toArray();
			res.send(result);
		});
		app.get("/feedback2", async (req, res) => {
			const result = await collageFeedback.find().toArray();
			res.send(result);
		});
		app.post("/info", async (req, res) => {
			const data = req.body;
			const result = await collageUser.insertOne(data);
			res.send(result);
		});
		app.get("/profile/:email", async (req, res) => {
			const email = req.params.email;
			const query = { email: email };
			const result = await collageUser.findOne(query);
			res.send(result);
		});
		app.get("/MyCollage/:email", async (req, res) => {
			const email = req.params.email;
			const query = { email: email };
			const result = await bookedCollage.find(query).toArray();
			res.send(result);
		});

		app.post("/feedback", async (req, res) => {
			const data = req.body;
			const result = await collageFeedback.insertOne(data);
			res.send(result);
		});

		app.post("/apply", async (req, res) => {
			const data = req.body;
			const result = await bookedCollage.insertOne(data);
			res.send(result);
		});
		app.get("/details/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await allCollage.findOne(query);
			res.send(result);
		});
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("ECommerce server is running");
});

app.listen(port, () => {
	console.log(`ECommerce is running on port ${port}`);
});
