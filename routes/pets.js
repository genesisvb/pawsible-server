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

function addPhotoUrl(pet) {
  return {
    ...pet,
    photoUrl: `http://localhost:5000/images/${pet.photo}`,
  };
}

function readPetsData() {
  const petFile = fs.readFileSync(dataFile);
  const petData = JSON.parse(petFile);
  return petData;
}

petsRouter.get("/", (request, response) => {
  response.status(200).json(readPetsData().map(addPhotoUrl));
});

petsRouter.get("/:id", (request, response) => {
  const pet = readPetsData().find((pet) => pet.id === request.params.id);

  if (pet) {
    response.status(200).json(addPhotoUrl(pet));
  } else {
    response.status(404).send(`Pet with id ${request.params.id} not found`);
  }
});

petsRouter.put("/:id", (request, response) => {
  const petsData = readPetsData();
  const pet = petsData.find((pet) => pet.id === request.params.id);

  if (pet) {
    const body = request.body;
    pet.photo = body.photo;
    pet.species = body.species;
    pet.name = body.name;
    pet.breed = body.breed;
    pet.gender = body.gender;
    pet.character = body.character;
    pet.age = body.age;
    pet.area = body.area;
    pet.tasks = body.tasks;
    pet.notes = body.notes;

    writePetsData(petsData);

    response.status(200).json(pet);
  } else {
    response.status(404).send(`Pet with id ${request.params.id} not found`);
  }
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
    age: body.age,
    area: body.area,
    tasks: body.tasks,
    notes: body.notes,
  };

  petsData.push(newPet);

  writePetsData(petsData);

  response.status(201).json(newPet);
});

module.exports = petsRouter;
