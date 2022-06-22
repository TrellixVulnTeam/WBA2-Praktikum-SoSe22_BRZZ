const { nanoid } = require('nanoid');

var express = require('express');
var router = express.Router();
var db = require('../database');

router.post("/new", async (req, res) => {
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
        res.send(JSON.stringify({ "id": new_question_id }));
    });
});

router.get("/cathegory/:cathegory", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/like", (req, res) => {
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

router.post("/dislike", (req, res) => {
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

module.exports = router;