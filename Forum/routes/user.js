const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const multer = require('multer');
var pathFunc = require('path');

var express = require('express');
var router = express.Router();
var db = require('../database');

/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

// USERS
router.post("/new", async (req, res) => {
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

// USERNAME
router.get("/name/:id", (req, res) => {
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

// PROFILEDATA
router.get("/profileData/:id", (req, res) => {
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
      output = {userdata: rows[0]}

      var sql = "SELECT * FROM questions WHERE userid = '" + id + "';";
      var params = [];
      db.all(sql, params, (err, rows) => {
        if (err) {
          res.sendStatus(400)
          return;
        }
        else{
          output.questions = rows;

          var sql = "SELECT * FROM answers WHERE userid = '" + id + "';";
          var params = [];
          db.all(sql, params, (err, rows) => {
            if (err) {
              res.sendStatus(400)
              return;
            }
            else{
              output.answers = rows;

              res.send(JSON.stringify(output));
            }
          });        
        }
      });
    }
  });
});

// PROFILE PICTURES
router.get("/profilePicture", (req, res) => {
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

router.get("/profilePicture/:id", (req, res) => {
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

router.post("/profilePicture", async function (req, res) {
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
          res.send("<script>window.location.href = '/profile.html?" + id + "';</script>")
        }
      });
    }
  });
});

// SESSIONS
router.post("/new_session", async (req, res) => {
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

router.get("/isLoggedIn", (req, res) => {
  if (req.body.sessionUserId == "0"){
    resJSON = {loggedin: "false"}
    res.send(resJSON)
  }
  else {
    resJSON = {loggedin: "true", userid: req.body.sessionUserId}
    res.send(resJSON)
  }
})

router.get("/logout", (req, res) => {
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

module.exports = router;
