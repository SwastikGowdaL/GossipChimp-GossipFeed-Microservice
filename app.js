const express = require('express');
const path = require('path');
const cors = require('cors');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(cors());

const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));

module.exports = app;
