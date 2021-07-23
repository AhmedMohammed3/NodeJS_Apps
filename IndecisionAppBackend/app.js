const express = require('express');
const mongoose = require('mongoose');
const env = require('./utils/env');
const { MONGODB_URI } = require('./utils/constants');
const mainRoutes = require('./routes/main.route');
const { StatusCodes } = require('http-status-codes');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true })); // this is for data of type application/x-www-form-urlencoded
app.use(express.json()); // this is for data of type application/json

const whitelist = [env.FRONTEND_URI]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error())
        }
    },
    methods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}
app.use(cors(corsOptions));

app.use('/main', mainRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
});

mongoose.connect(MONGODB_URI,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(result => {
        app.listen(env.PORT || 12345);
        console.log(`Connected to DB and listening on ${env.PORT}`)
    })
    .catch(err => console.log('Can\'t connect to DB', err));
