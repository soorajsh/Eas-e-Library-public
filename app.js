const express = require('express');

const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql');

const app = express();
// //EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


//BodyParser
// app.use(require('body-parser').urlencoded());

app.use(express.urlencoded({ extended: true }))

//Routes 
app.use('/', require('./routes/index'));
app.use('/members', require('./routes/members'));
app.use('/staffs', require('./routes/staffs'));

app.set('views', './views');

// app.use('/signup', require('./routes/members'));


app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));





const PORT = process.env.PORT || 4444;

// const PORT = 4444;


app.listen(PORT, console.log(`Server started on port ${PORT}`));
// app.listen(PORT);