const express = require('express');
var db = require('../database');
const cookieParser = require("cookie-parser");

const app = module.exports = express();

app.use(express.static('public'));

app.use(cookieParser());

app.use("/", (req, res, next) => {
  sessionId = req.cookies.sessionid
  if (sessionId) {
    var sql = "SELECT * FROM usersessions WHERE id = '" + req.cookies.sessionid + "';"
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      if (rows.length == 0) {
        userid = "0"
      }
      else {
        if (parseInt(rows[0].endTime) < Date.now()) {
          console.log(String(sessionId) + " - Session already ended")
          userid = "0"
        }
        else if (parseInt(rows[0].startTime) > Date.now()) {
          console.log(String(sessionId) + " - Session hasn't started yet")
          userid = "0"
        }
        else {
          console.log(String(sessionId) + " - Valid Session")
          userid = rows[0].userId
        }
      }
      req.body.sessionUserId = userid
      next()
    });
  }
  else {
    req.body.sessionUserId = "0"
    next()
  }
});
