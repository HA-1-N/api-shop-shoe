const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const db = require("./config/db/index");
const route = require("./routes");

dotenv.config();
db.connect();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});