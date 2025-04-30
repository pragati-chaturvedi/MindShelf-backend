const express = require("express")
const app = express()
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors());
const dbConnection = require("./helpers/dbConnection");

const PORT = process.env.PORT || 3000;
const { summarize , getSummary, search} = require("./routes")


app.use("/api", summarize);
app.use("/api", getSummary);
app.use("/api", search);


dbConnection()
  .then((status) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `App listening at http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => console.log(err));

