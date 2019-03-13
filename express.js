Promise = require('bluebird');
mysql = require('mysql');
DBF = require('./dbf-setup.js');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;


app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM forever_alone.till_buttons';
  var result = DBF.query(mysql.format(sql));

  //Use the .then stuff to make everything better
  result.then(function(bts, error) {
      res.send(bts);
  })

});

app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'select price from forever_alone.prices where prices.id=' + id;
  console.log("Attempting sql ->"+sql+"<-");

  var result = DBF.query(mysql.format(sql));

  result.then(function(price, error) {
      res.send(price);
  })

});

app.get("/list",function (req,res) {
    var id = req.param('id');
    var sql = 'update cart set item='+id;//this isn't right yet
})

app.listen(port);
