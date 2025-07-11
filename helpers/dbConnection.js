const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let dbInstance;
async function run() {
  if (!dbInstance) {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      dbInstance = client.db("mindShelf");
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error; // throw the error so the caller knows connection failed
    }
  }
  return dbInstance;
}

module.exports = run;
