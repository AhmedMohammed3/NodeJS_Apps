const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const quoteRoutes = require('./routes/auth.route');
const { PORT } = require('./helpers/constants');

const MONGODB_URI =
	'mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/authdb?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority';

const app = express();

// process.env.PORT = 1234;

app.use(express.json()); // this is for data of type application/json

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/auth', quoteRoutes);

app.use((err, req, res, next) => {
	console.log('Error Sent to user');
	console.log('err.statusCode:', err.statusCode);
	console.log('err.message:', err.message);
	res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(result => {
		app.listen(PORT);
		console.log('Server is listening on port ' + PORT);
	})
	.catch(err => console.log(err));
