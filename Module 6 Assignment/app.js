const express = require('express');

const app = express();

const users = [];



app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Add User' });
});

app.get('/users', (req, res, next) => {
    console.log(users);
    res.render('users', { pageTitle: 'Users', users: users });
});

app.post('/add-user', (req, res, next) => {
    users.push(req.body);
    res.redirect('/users');
});

app.listen(1234);