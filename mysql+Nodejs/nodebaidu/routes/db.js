var mysql = require('mysql');

var connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'baidunews-php',
    password: '123456',
    database: 'baidunews_wrh'
});

connection.getConnection(function(err,connection){
	if(err){
		console.log("connection false");
	}
});

exports.connection=connection;
