const express = require('express');
const { path } = require('express/lib/application');
var router = express.Router();
const app = express();
var db = require('../database')

app.use(express.static('public'));

//router.get('/', function(req, res, next) {

  //res.render('index', { title: 'Express' });
  //res.sendFile(__dirname + '/html/home.html');
  //res.sendFile(__dirname + '/html/header.js')
  //res.sendFile(__dirname + '/html/lib/style.css');
//});

router.post("/test", (req, res) => {
  let jsonData = req.body;
  var sql = "insert into test VALUES ('" + jsonData.id + "', '" + jsonData.id + "');"
  console.log(sql);
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.send(200);
  });
});

module.exports = router;
