const express = require('express');
const { path } = require('express/lib/application');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
var router = express.Router();
const app = express();
var db = require('../database');
const { json } = require('express/lib/response');
const { hash } = require('bcrypt');

app.use(express.static('public'));

//router.get('/', function(req, res, next) {

//res.render('index', { title: 'Express' });
//res.sendFile(__dirname + '/html/home.html');
//res.sendFile(__dirname + '/html/header.js')
//res.sendFile(__dirname + '/html/lib/style.css');
//});

router.post("/new_user", async (req, res) => {
  let jsonData = req.body;
  let new_id = nanoid();
  let new_join_date = new Date().toISOString().slice(0, 10);
  let profilepicturepath = "/default";
  
  const salt = await bcrypt.genSalt(2);
  const hashed_password = await bcrypt.hash(jsonData.password, salt);
  
  var sql = "insert into users (id, firstname, lastname, email, username, passwordhash, joindate, profilepicturepath ) VALUES ('" + new_id + "', '" + jsonData.first_name + "', '" + jsonData.last_name + "','" + jsonData.email + "','" + jsonData.username + "','" + hashed_password + "','" + new_join_date + "','" + profilepicturepath + "');"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

module.exports = router;
