const express = require("express");

const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT;
const dbUri = process.env.DATABASE_URI
const app = express();

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true } );
mongoose.connection.once("open", ()=> console.log("DB connected")).on("error", err => console.log(`Connection Error: ${err}`));


app.listen(port, () => console.log(`Server listening on port: ${port}`));

