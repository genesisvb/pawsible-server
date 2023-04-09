const express = require("express");
const petsRouter = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const multer = require("multer");
const dataFile = "./data/pets.json";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "/public/images/");
  },
});
const upload = multer({ storage });

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

petsRouter.post("/", (request, response) => {
  const petsData = readPetsData();
  const body = request.body;
  const newPet = {
    id: uuid(),
    photo: "photo url",
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
