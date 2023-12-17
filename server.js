	
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

const bcrypt = require("bcrypt")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

app.use(express.json());

// default route
app.get('/', function (req, res) {
return res.send({ error: true, message: 'hello' })
});

// connection configurations
var dbConn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'nodereact'
});

// connect to database
dbConn.connect(); 

// Retrieve all users 
app.get('/users', function (req, res) {

    dbConn.query('SELECT * FROM users', function (error, results, fields) {

    if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });

});

app.post('/user', (req, res)=>{

    const data = [req.body.name, req.body.email];

    dbConn.query('INSERT INTO users (name, email) VALUES (?, ?)', data, (err, result)=>{
        if(err){
            res.send("Error");
        }else{
            res.send(result);
        }
    })  
});


//  Update user with id
app.put('/user/:id', function (req, res) {
 
    let user_id = req.params.id;

    let name = req.body.name;
    let email = req.body.email;
 
    if (!user_id || !name || !email) {
        return res.status(400).send({ error: user, message: 'Please provide name, email and user_id' });
    }
 
    dbConn.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});


// Retrieve user with id 
app.get('/user/:id', function (req, res) {

    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {

    if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

//  Delete user
app.delete('/user/:id', function (req, res) {

    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {

    if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});

/* Encryption Method */
// app.post('/user_encrypt', (req, res)=>{

//     const data = [req.body.username, req.body.email, req.body.password];
    
//     dbConn.query('INSERT INTO userss (username, email, password) VALUES (?, ?, ?)', data, (err, result)=>{
//         if(err){
//             res.send("Error");
//         }else{
//             res.send(result);
//         }
//     })

//     const pass = HASH("123456789");
//     res.send(pass);
// });


app.listen(3001, function () {
    console.log('Node app is running on port 3001');
});
module.exports = app;