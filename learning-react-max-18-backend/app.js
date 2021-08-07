const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const quoteRoutes = require('./routes/quote.route');
const commentsRoutes = require('./routes/comment.route');

const MONGODB_URI =
	'mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/quotesdb?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority';

const app = express();

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

app.use('/quotes', quoteRoutes);
app.use('/comments', commentsRoutes);

app.use((err, req, res, next) => {
	res
		.status(err.statusCode || 500)
		.json({ message: err.message, data: err.data ? err.data : undefined });
});

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(result => {
		app.listen(1234);
		console.log('Server is listening on port 1234');
	})
	.catch(err => console.log(err));
