var express = require('express');
var router = express.Router();
var db = require('./db.js');
var xss = require('xss');

/* 后台路由文件. */

/*获取所有新闻列表*/
router.get('/getnews', function(req, res, next) {
    db.connection.query('SELECT * FROM `news`', function(err, rows, fields) {
        res.json(rows);
    })
});

/*确认更新*/
router.post('/update', function(req, res) {
    var newsid = req.body.id,
        newstype = req.body.newstype,
        newstitle = req.body.newstitle,
        newsimg = req.body.newsimg,
        newstime = req.body.newstime,
        newssrc = req.body.newssrc;

     var thistitle = null;
     var count = 0;

     db.connection.query('SELECT *FROM `news` WHERE id=?', [newsid], function(err, rows) {
        rows.forEach(function(e) {
            thistitle = e.newstitle;
            //console.log("##thistitle = " + thistitle);
        });
        /*获取与修改的title一样的新闻数：*/
        db.connection.query('select count(0) as count from news where newstitle=?', [newstitle], function(err, rows) {
            rows.forEach(function(e) {
                count = e.count;
                //console.log("##count = " + count);
            });
            /*有重复且不是本身：*/
            if ((count > 0) && (newstitle != thistitle)) { 
                res.json({ "success": "alreadyhad" });
            } else {
                db.connection.query('UPDATE `news` SET `newstitle`=?,`newstype`=?,`newsimg`=?,`newstime`=?,`newssrc`=? WHERE `id`=?', [newstitle, newstype, newsimg, newstime, newssrc, newsid], function(err, rows) {
                	if (err) {
			            res.json({ "update": "fail" });
			        }else{
			        	res.json({ "update": "success" });
			        }
                    
                });
            }
        });
    });
});

/*模态框取值*/
router.get('/curnews', function(req, res) {
    var newsid = req.query.newsid;
    db.connection.query('SELECT *FROM `news` WHERE id=?', [newsid], function(err, rows) {
        res.json(rows);
    })
});

/*delete*/
router.post('/delete', function(req, res) {
    var newsid = req.body.newsid;
    db.connection.query('DELETE FROM `news` WHERE `news`.`id`=?', [newsid], function(err, result) {
        //console.log(result.affecteRows);
        if (!err) {
            res.json({ "delete": "success" });
        } else {
            res.json({ "delete": "fail" });
        }
    });
});

/*insert*/
router.post('/insert', function(req, res) {
    var newstime = req.body.newstime,
        newstype = req.body.newstype,
        newstitle = req.body.newstitle, 
        newsimg = req.body.newsimg,
        newssrc = req.body.newssrc;
	var thistitle = null;
    var count = 0;
  
    /*获取与修改的title一样的新闻数：*/
    db.connection.query('select count(0) as count from news where newstitle=?', [newstitle], function(err, rows) {
        rows.forEach(function(e) {
            count = e.count;
            //console.log("##count = " + count);
        });
        /*有重复：*/
        if (count > 0) { 
            res.json({ "success": "alreadyhad" });
        } else {
            db.connection.query('INSERT INTO `news` (`newstitle`,`newstype`,`newsimg`,`newstime`,`newssrc`) VALUES (?,?,?,?,?)', [newstitle, newstype, newsimg, newstime, newssrc], function(err, result) {
		        if (!err) {
		            //console.log(result.insertId);
		            res.json({ "delete": "success" });
		        } else {
		            res.json({ "delete": "fail" });
		        }
		    });
        }
    });   
});



module.exports = router;
