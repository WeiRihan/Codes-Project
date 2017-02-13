var express = require('express');
var router = express.Router();
var db = require('./db.js');

/* 在主页获取新闻时的请求. */
router.get('/', function(req, res, next) {
  var newstype = req.query.newstype;

  db.connection.query('SELECT * FROM `news` WHERE `newstype` = ?',[newstype],function(err,rows,fields){
  		res.json(rows);
  })
});

module.exports = router;
