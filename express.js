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
  result.then(function(result, error) {
      res.send(result);
  })

});

app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'insert into forever_alone.cart values('+id+', 1) on duplicate key update amount=amount+1;';
  // console.log("Attempting sql ->"+sql+"<-");

  var result = DBF.query(mysql.format(sql));

  result.then(function(price, error) {
      res.send(price);
  })

});

app.get("/list",function (req,res) {
    var sql = 'select invID as id, item as name, cart.amount, price*cart.amount as cost ' +
        'from forever_alone.inventory, forever_alone.cart, forever_alone.prices ' +
        'where inventory.id=invID and prices.id=invID;';
    var result = DBF.query(mysql.format(sql));

    result.then(function(items, error) {
        res.send(items);
    })
});

app.get("/delete",function (req,res) {
    var id = req.param('id');
    var sql = 'delete from forever_alone.cart where invID='+id;
    var result = DBF.query(mysql.format(sql));

    // console.log("Attempting sql ->"+sql+"<-");

    result.then(function(items, error) {
        res.send('');
    });

})

app.listen(port);
