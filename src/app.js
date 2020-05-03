const express = require('express');
const app = express();
//const router = express.Router();
//Rotas
const index = require('./routes/index');
const caesarcipher = require('./routes/caesarcipherRoute');

//const app = require('../src/app');
const port = process.env.PORT || 3000;

app.use('/', index);
app.use('/cipher', caesarcipher);

app.listen(port, function () {
    console.log(`app listening on port ${port}`)
});

module.exports = app;