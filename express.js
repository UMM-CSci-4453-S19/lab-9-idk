Promise = require('bluebird');
mysql = require('mysql');
DBF = require('./dbf-setup.js');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;


app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM forever_alone.till_buttons';
  DBF.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});
app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'select price from forever_alone.prices where prices.id=' + id;
  console.log("Attempting sql ->"+sql+"<-");

  var result = DBF.query(mysql.format(sql));



  DBF.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(result); // Let the upstream guy know how it went
  }})(res));
});
// Your other API handlers go here!

app.listen(port);
