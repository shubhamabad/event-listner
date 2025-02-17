const express = require("express");
const bodyParser = require("express");
const receiverController = require("./controllers/receiverController");

const app = express();
app.use(bodyParser.json());

app.post("/receiver", receiverController.receiveData);

module.exports = app;