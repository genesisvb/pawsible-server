const express = require("express");
const petsRouter = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const dataFile = "./data/pets.json";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, `${uuid()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

function writePetsData(data) {
  const newData = JSON.stringify(data);
  fs.writeFileSync(dataFile, newData);
}

function readPetsData() {
  const petFile = fs.readFileSync(dataFile);
  const petData = JSON.parse(petFile);
  return petData;
}
// upload.single("avatar")
petsRouter.get("/", (request, response) => {
  response.status(200).json(readPetsData());
});

petsRouter.post("/photos", upload.single("photo"), (request, response) => {
  response.status(200).json({ filename: request.file.filename });
});

petsRouter.post("/", (request, response) => {
  const petsData = readPetsData();
  const body = request.body;
  const newPet = {
    id: uuid(),
    photo: body.photo,
    species: body.species,
    name: body.name,
    breed: body.breed,
    gender: body.gender,
    character: body.character,
    age: body.area,
    area: body.area,
    tasks: body.tasks,
    notes: body.notes,
  };

  petsData.push(newPet);

  writePetsData(petsData);

  response.status(201).json(newPet);
});

module.exports = petsRouter;
