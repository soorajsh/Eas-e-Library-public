var express = require('express');
const router = express.Router();
const mysql = require('mysql');
// const http = require('http');

const bcrypt = require('bcryptjs');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


//Member Model
// const Member = require('../models/Member');
router.get('/', (req, res) => res.render('landingpage'));
router.get('/#modal', (req, res) => res.render('landingpage#modal'));

router.get('/signin', (req, res) => res.render('signin'));
router.get('/memberdashboard', (req, res) => res.render('memberdashboard'));
router.get('/signup', (req, res) => res.render('signup'));
// router.get('/viewbooks', (req, res) => res.render('viewbooks'));

router.get('/search', (req, res) => res.render('search'));

//Sigin Handling POST
router.post('/signup', (req, res) => {
    const { member_name, member_email, member_address, member_gender, member_passwd, member_passwd2, member_citizen_number, member_citizenship } = req.body;
    let errors = [];
    //Check required fields
    // if (!member_name || !member_email || !member_address || !member_passwd || !member_passwd2 || !member_citizenship || !member_citizen_number) {
    //     errors.push({ msg: 'Please fill in required fields.' });
    // }
    if (req.body.member_passwd !== req.body.member_passwd2) {
        errors.push({ msg: 'Passwords do not match.' });

    }
    // check pass length
    if (member_passwd.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters long.' });
    }

    //Email Validation
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (member_email.length > 254)
        errors.push({ msg: 'Invalid Email address.' });

    var valid = emailRegex.test(member_email);
    if (!valid) {
        errors.push({ msg: 'Invalid Email address.' });
        console.log(member_email);
    }


    // // Further checking of some things regex can't handle
    // var parts = member_email.split("@");
    // if (parts[0].length > 64)
    //     errors.push({ msg: 'Invalid Email address.' });


    // var domainParts = parts[1].split(".");
    // if (domainParts.some(function(part) { return part.length > 63; }))
    //     errors.push({ msg: 'Invalid Email address.' });


    if (errors.length > 0) {
        res.render('signup', {
            errors,
            member_name,
            member_address,
            member_email,
            member_gender,
            member_passwd,
            member_passwd2,
            member_citizen_number,
            member_citizenship
        });
        console.log(errors.length)
    } else {

        const db = mysql.createConnection({
            host: 'localhost',
            user: 'ease',
            password: 'root',
            database: 'ease'
        });
        //Connect to databse
        db.connect((err) => {
            if (err) {
                throw err;
            }
            console.log("Mysql Connected");
        });

        var sql = "SELECT * from members where email='" + req.body.member_email + "'";

        db.query(sql, function (err, result) {
            // console.log(result);
            // console.log(result.length);



            if (result.length != 0) {
                errors.push({ msg: 'Email already exists.' });
                res.render('signup', {
                    errors,
                    member_name,
                    member_address,
                    member_email,
                    member_gender,
                    member_passwd,
                    member_passwd2,
                    member_citizen_number,
                    member_citizenship
                });
                db.end();
            } else {
                var sql2 = "insert into members values(null, '" + req.body.member_name + "','" + req.body.member_email + "','" + req.body.member_address + "','" + req.body.member_gender + "','" + req.body.member_passwd + "','" + req.body.member_citizen_number + "','" + req.body.member_citizenship + "')";

                db.query(sql2, (error, result, fields) => {
                    // console.log(result);
                    if (error) throw error;
                    // res.render('landingpage', {
                    //     title: 'Data Submitted',
                    //     message: 'Data Submitted succesfully.'
                    // });
                    res.redirect('memberdashboard');

                });
            }

        });

    }

});


//------------ Login Section -----------
// router.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));


router.post('/signin', (req, res) => {
    var email = req.body.email;
    var passwd = req.body.passwd;
    let errors_signin = [];
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'ease',
        password: 'root',
        database: 'ease'
    });
    //Connect to databse
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Mysql Connected");
    });
    db.query('SELECT * FROM members WHERE email = ?', [email], function (error, results, fields) {
        if (results.length == 0) {
            errors_signin.push({ msg: 'Invalid email address.' });
            // res.render('signup');
            console.log('Erroremail:' + errors_signin.length);
            if (errors_signin.length > 0) {
                res.render('landingpage', {
                    errors_signin,
                    email,
                    passwd
                });
            }

        } else {
            console.log('Valid Email');
            db.query('SELECT * FROM members WHERE passwd = ?', [passwd], function (error, results, fields) {
                if (results.length == 0) {
                    console.log(results.length);

                    errors_signin.push({ msg: 'Password mismatched.' });

                    console.log('Errorpasss:' + errors_signin.length);
                    // res.render('signup');
                    if (errors_signin.length > 0) {
                        res.render('landingpage', {
                            errors_signin,
                            email,
                            passwd
                        });
                    }
                } else {
                    res.redirect('memberdashboard');
                    console.log(results.length);
                }
            });
        }


    });

    // console.log(email);
    // console.log(passwd);
    // console.log('Erroes:' + errors_signin.length);

    // if (errors_signin.length > 0) {
    //     res.render('/#modal', {
    //         errors_signin,
    //         email,
    //         passwd
    //     });
    //     // console.log('Erroes:' + errors_signin);
    // } else {
    //     const db = mysql.createConnection({
    //         host: 'localhost',
    //         user: 'ease',
    //         password: 'password',
    //         database: 'ease'
    //     });
    //     //Connect to databse
    //     db.connect((err) => {
    //         if (err) {
    //             throw err;
    //         }
    //         console.log("Mysql Connected");
    //     });

    //     db.query('SELECT * FROM members WHERE email = ? AND passwd = ?', [email, passwd], function(error, results, fields) {

    //         if (email && passwd) {

    //             db.query('SELECT * FROM members WHERE email = ? AND passwd = ?', [email, passwd], function(error, results, fields) {
    //                 if (results.length > 0) {
    //                     // req.session.loggedin = true;
    //                     // req.session.email = email;
    //                     res.redirect('dashboard');
    //                     console.log(results.length);
    //                 }
    //                 // else {

    //                 // }
    //                 // res.end();
    //             });

    //         } else {

    //         }
    //     });
    // }
});

// router.get('/signin', function(request, response) {
//     if (request.session.loggedin) {
//         response.send('Welcome back, ' + request.session.email + '!');
//     } else {
//         response.send('Please login to view this page!');
//     }
//     response.end();
// });



var obj = {};
router.get('/viewbooks', function (req, res) {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'ease',
        password: 'root',
        database: 'ease'
    });
    //Connect to databse
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Mysql Connected");
        console.log("Connected");

        db.query('SELECT * from books', function select(error, results, fields) {
            var temp = "";
            if (error) {
                console.log(error);
                db.end();
            }
            res.render('viewbooks', { data: results, error: null });
            //pool.end();
        });
    });

});






router.post('/search', (req, res) => {
    var search_text = req.body.search_text;
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'ease',
        password: 'root',
        database: 'ease'
    });
    //Connect to databse
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Mysql Connected");
        console.log("Connected");

        db.query('SELECT * from books where title= ?', [search_text], function select(error, results, fields) {
            var temp = "";
            if (error) {
                console.log(error);
                db.end();
            }
            res.render('search', { data: results, error: null });
            console.log(results);

        });
    });
});

module.exports = router;