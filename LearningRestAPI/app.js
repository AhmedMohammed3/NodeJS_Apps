const express = require('express');

const feedRoutes = require('./routes/feed-routes');

const app = express();

// app.use(express.urlencoded()); // this is for data of type application/x-www-form-urlencoded
app.use(express.json()); // this is for data of type application/json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.listen(1234);