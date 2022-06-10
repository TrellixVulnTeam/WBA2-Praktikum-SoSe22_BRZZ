const express = require('express');
const { path } = require('express/lib/application');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
var router = express.Router();
const app = module.exports = express();
var db = require('../database');
const { json } = require('express/lib/response');
const { hash } = require('bcrypt');
const req = require('express/lib/request');
const cookieParser = require("cookie-parser");
const multer = require('multer');
var pathFunc = require('path');

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

app.get("/isLoggedIn", (req, res) => {
  if (req.body.sessionUserId == "0"){
    resJSON = {loggedin: "false"}
    res.send(resJSON)
  }
  else {
    resJSON = {loggedin: "true", userid: req.body.sessionUserId}
    res.send(resJSON)
  }
})

app.post("/new_user", async (req, res) => {
  let jsonData = req.body;
  let new_id = nanoid();
  let new_join_date = new Date().toISOString().slice(0, 10);
  let profilepicturepath = "/default.png";

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

app.post("/new_session", async (req, res) => {
  let jsonData = req.body;
  let user = jsonData.username;
  let password = jsonData.password;

  var sql = "SELECT * FROM users WHERE username = '" + user + "';"
  var params = [];
  db.all(sql, params, async (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (rows.length == 0) {
      res.status(200).json({ "status": "usrwrong" });
      res.send;
      return;
    }
    if (await bcrypt.compare(password, rows[0].passwordhash)) {
      let new_session_id = nanoid();
      let new_user_id = rows[0].id;
      let new_start_time = Date.now()
      let new_end_time = new_start_time + (60 * 60 * 1000)
      var sql = "INSERT INTO usersessions (id, userId, startTime, endTime) VALUES ('" + new_session_id + "', '" + new_user_id + "', '" + new_start_time + "', '" + new_end_time + "');"
      var params = [];
      db.all(sql, params, (err, new_rows) => {
        output = {
          "sessionid": new_session_id,
          "startTime": new_start_time,
          "endTime": new_end_time,
          "status": "correct"
        };
        res.status(200).json(output);
      });
    }
    else {
      res.status(200).json({ "status": "pwwrong" });
      res.send;
    }
  });
});

app.get("/logout", (req, res) => {
  let userid = req.body.sessionUserId;
  var sql = "DELETE FROM usersessions WHERE userId = '" + userid + "';"
  console.log(sql)
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send("<script>window.location.href = '/';</script>");
  })
})

app.post("/new_question", async (req, res) => {
  let jsonData = req.body;
  let new_question_id = nanoid();
  let new_date_posted = new Date().toISOString().slice(0, 10);
  let userid = req.body.sessionUserId;
  let upvotes = 0;
  let downvotes = 0;

  var sql = "insert into questions (id, userid, questiontext, explanation, dateposted, upvotes, downvotes, categorie) VALUES ('" + new_question_id + "', '" + userid + "', '" + jsonData.question + "','" + jsonData.explanation + "','" + new_date_posted + "','" + upvotes + "','" + downvotes + "','" + jsonData.categorie + "');"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(JSON.stringify({"id": new_question_id}));
  });
});

app.post("/new_answer/:id", async (req, res) => {
  let answertext = req.body.answerText;
  let new_answer_id = nanoid();
  let new_date_posted = new Date().toISOString().slice(0, 10);
  let userid = req.body.sessionUserId;
  let upvotes = 0;
  let downvotes = 0;

  var sql = "insert into answers (id, userid, questionid, answertext, dateposted, upvotes, downvotes) VALUES ('" + new_answer_id + "', '" + userid + "', '" + req.params.id + "','" + answertext + "','" + new_date_posted + "','" + upvotes + "','" + downvotes + "');"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

app.get("/questions/:cathegory", (req, res) => {
  var sql = "SELECT * FROM questions WHERE categorie = '" + req.params.cathegory + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.get("/answers/:id", (req, res) => {
  var sql = "SELECT * FROM answers WHERE questionid = '" + req.params.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.get("/question/:id", (req, res) => {
  var sql = "SELECT * FROM questions WHERE id = '" + req.params.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.post("/likeQuestion", (req, res) => {
  let jsonData = req.body;
  var sql = "UPDATE questions SET upvotes=upvotes+1 WHERE id = '" + jsonData.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

app.post("/dislikeQuestion", (req, res) => {
  let jsonData = req.body;
  var sql = "UPDATE questions SET downvotes=downvotes+1 WHERE id = '" + jsonData.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

app.post("/likeAnswer", (req, res) => {
  let jsonData = req.body;
  var sql = "UPDATE answers SET upvotes=upvotes+1 WHERE id = '" + jsonData.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

app.post("/dislikeAnswer", (req, res) => {
  let jsonData = req.body;
  var sql = "UPDATE answers SET downvotes=downvotes+1 WHERE id = '" + jsonData.id + "';"
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.sendStatus(200);
  });
});

app.get("/profilePicture", (req, res) => {
  let jsonData = req.body;
  let id = jsonData.sessionUserId;
  var sql = "SELECT * FROM users WHERE id = '" + id + "';";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    else if (rows.length == 0) {
      res.sendFile(pathFunc.join(__dirname, '../public', "lib/profilePictures/default.png"))
    }
    else {
      res.sendFile(pathFunc.join(__dirname, '../public', "lib/profilePictures" + rows[0].profilepicturepath))
    }
  });
});

app.get("/profilePicture/:id", (req, res) => {
  let id = req.params.id;
  var sql = "SELECT * FROM users WHERE id = '" + id + "';";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    else if (rows.length == 0) {
      res.sendFile(pathFunc.join(__dirname, '../public', "lib/profilePictures/default.png"))
    }
    else {
      res.sendFile(pathFunc.join(__dirname, '../public', "lib/profilePictures" + rows[0].profilepicturepath))
    }
  });
});

app.post("/profilePicture", async function (req, res) {
  let jsonData = req.body;
  let id = jsonData.sessionUserId;

  var sql = "SELECT * FROM users WHERE id = '" + id + "';";
  var params = [];
  db.all(sql, params, async function (err, rows) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    else if (rows.length == 0) {
      res.sendStatus(400);
      return;
    }
    else {
      newName = Date.now() + "-" + nanoid() + ".jpg"
      const storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, 'public/lib/profilePictures');
        },
        filename: function(req, file, cb) {
          cb(null, newName);
        }
      });

      const imageFilter = function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      };

      let upload = multer({ storage: storage, fileFilter: imageFilter }).single('profile_pic');

      upload(req, res, function(err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        }
        else if (!req.file) {
          return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
          return res.send(err);
        }
        else if (err) {
          return res.send(err);
        }
      })

      var sql = "UPDATE users SET profilepicturepath = '/" + newName + "' WHERE id = '" + id + "';"
      var params = [];
      db.all(sql, params, (err, rows) => {
        if (err){
          res.sendStatus(400);
        }
        else{
          res.send("<script>window.location.href = '/profile.html';</script>")
        }
      });
    }
  });
});

app.get("/username", (req, res) => {
  let jsonData = req.body;
  let id = jsonData.sessionUserId;
  var sql = "SELECT * FROM users WHERE id = '" + id + "';";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.sendStatus(400)
      return;
    }
    else if (rows.length == 0) {
      res.sendStatus(400)
      return;
    }
    else {
      output = { username: rows[0].username }
      res.send(JSON.stringify(output));
    }
  });
});

app.get("/username/:id", (req, res) => {
  let id = req.params.id;
  var sql = "SELECT * FROM users WHERE id = '" + id + "';";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.sendStatus(400)
      return;
    }
    else if (rows.length == 0) {
      res.sendStatus(400)
      return;
    }
    else {
      output = { username: rows[0].username }
      res.send(JSON.stringify(output));
    }
  });
});