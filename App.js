const express = require("express")
const app = express()
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors());

const dbConnection = require("./helpers/dbConnection");
const { summarize, getSummary, search } = require("./routes")
const verifyFirebaseToken = require("./middleware/authMiddleware");


const PORT = process.env.PORT || 3000;

app.use("/api", verifyFirebaseToken, summarize);
app.use("/api", verifyFirebaseToken, getSummary);
app.use("/api", verifyFirebaseToken, search);


dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `App listening at http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => console.log(err));

