const { nanoid } = require('nanoid');

var express = require('express');
var router = express.Router();
var db = require('../database');

router.get("/:id", (req, res) => {
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

router.post("/new/:id", async (req, res) => {
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

router.post("/like", (req, res) => {
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

router.post("/dislike", (req, res) => {
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

module.exports = router;