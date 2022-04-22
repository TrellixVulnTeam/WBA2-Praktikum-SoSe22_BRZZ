const express = require('express');
const { path } = require('express/lib/application');
var router = express.Router();
const app = express();

app.use(express.static('public'));

//router.get('/', function(req, res, next) {

  //res.render('index', { title: 'Express' });
  //res.sendFile(__dirname + '/html/home.html');
  //res.sendFile(__dirname + '/html/header.js')
  //res.sendFile(__dirname + '/html/lib/style.css');
//});

module.exports = router;
