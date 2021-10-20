const express = require('express');
const cors = require('cors');
require('./db/mongoose');

const app = express();
app.use(express.json());
app.use(cors());

module.exports = app;
