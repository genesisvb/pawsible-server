const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
const petsRouter = require("./routes/pets.js");

app.use(cors());
app.use(express.json());
app.use("/pets", petsRouter);
app.use(express.static("public"));

app.listen(PORT, () => {});
