# Lab 9

Lab 8 reference below (scroll down).

Your Lab 9 repository should include all you relevant files (and folders) from Lab 8.  In other words I should be able to clone the repository, run your server, and test your results without any extra steps other than copying in `credentials.json`. You could accomplish this by forking your Lab 8 repo or using [these nifty techniques](https://help.github.com/en/articles/duplicating-a-repository) to duplicate your Lab 8 repository (either the first or third option on that page would work for you). 

Be certain that the user `mcphee@146.57.33.%` has the appropriate privileges to execute all of the SQL commands used by your code.

Now it is it time to finish off this register project.  As you implement the functionality below, remember that your primary mode of interaction is through your REST interface.

* Add a login/logout function.  If no user is logged in, then no till buttons should be useable (you can make them invisible, or just not operational.)  Use whatever technique you would like.  Be sure to document this in your manual (discussed at the end of this lab.)
* Think about what it would take to write a procedure (or trigger) that would identify DEALS in the current `till_items` and update your table to reflect the new pricing.  Talk it over with your partners until you are convinced that you understand what needs to be done... then relax and congratulate yourselves on a job well done.
*  Modify your click API entry so the time stamp of a button is also recorded.
* Add REST handlers to deal with SALE and VOID.  You can decide whether or not to use `till_buttons` or hard-code the buttons into your angular template.  Produce your logic and button accordingly:

   * Add a **void** button that will erase all the curent contents in the register, 
   * Add a **sale** button.  (more on this below)

* Clicking on **sale** should implement special functionality that copies the till_items to a special archive (you will have to make an archive table).  The archive table should have a new field called transactionID and user.  (This is breaking some of the rules of normalization... be prepared to tell me in person what the poetential problems are and the proper way to fix them).  You can achieve this functionality however you like as long as it occurs on the DBF server.  Both procedures and triggers are viable options.  Be sure that your *sale* functionality adds an entry in the archive denoting the clicking of the sale button.
* Clicking on **void** does not have to add an entry in the archive (although you can do so if you like as long as such entries can be clearly identfied as voided transactions)
* Create a a view called `transactionSummary` that summarizes the transactions in the archive table.  It should show:

```
|field        | Description                                         |
|-------------|-----------------------------------------------------|
|transactionID| The transaction ID on which you will be grouping    |
|startTime    | earliest time stamp of a button in that transaction |
|stopTime     | latest time stamp of a button in that transaction   |
|duration     | difference in seconds of stopTime and startTime     |
|user         | user's name                                         |
|total        | total amount in sale                                |
```

* EITHER
   * Add a TICKETIZE option to your API that calls a suitably modified `ticketize` function (on the DBF side) to generate a JSON object that would, presumably, be used by a function to print out the receipt
   * Add javascript to your HTML template that pops up a suitable "receipt"
* Finally, you should expand your API document into a complete user manual (preferably with a few screen shots).  Make the API details into an appendix at the end.  (Don't go crazy on this step... but don't just gloss over it either...)
 
# Lab 8
Be sure to get enough REST

Now you are going to expand upon your work from the previous lab.  This is going to require the following components:

* A REST Interface (described in light detail below)
* An angular template (with javascript) to produce the web-page outputs
* A good understanding of how to manipulate tables 

## The REST interface

I'm purposefully leaving some of the REST interface details vague so you can decide how to implement them yourself.  I recommend the following *sort* of thing:

* USER/
  * Get current user
  * Change current user
* BUTTONS/
  * return JSON object of current buttons
  * modify values in till_buttons table (if you want to be fancy... NOT REQUIRED)
* CLICK/
  * update the current transaction table to reflect the-item button clicked
* SALE/
  * complete the current transaction and clear the transaction table
* VOID/
  * abort the current transaction
* LIST/
  * provide JSON object of items in current transaction
* DELETE/
  * remove item(s) from current transaction

This will be implemented by your node server which you will run by typing some variation on `node myserver.js`.  I'm choosing to call my server `express.js`

For example, here is a slimmed down version of `express.js`.  I have removed functional details in order to let you add those back in.  I implemented this version without Promises or connectionPools, but you probably want to to add those in.  The repository ONLY has a stub.

```js
var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM test.till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});
app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'YOUR SQL HERE'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});

app.listen(port);
```

## The angular template

You have done the tutorials (and many of you have worked with angular in other classes), so I'll just provide a sample of the sort of thing that I used to implement "clickability" on the item buttons (note:  I did NOT add the css file that I used):

```html
<!doctype html>
<html>
<head lang="en">
    <meta charset="utf-8">
    <title>Cash Register</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular.min.js"></script>
    <script src="click.js"></script>
</head>
<body ng-app="buttons">
<div class="container-fluid">
    <h1>Cash Register (with buttons)</h1>
    <div id="buttons" ng-controller="buttonCtrl" >
       <div ng-repeat="button in buttons">
         <div style="position:absolute;left:{{button.left}}px;top:{{button.top}}px"><button id="{{button.buttonID}}" ng-click="buttonClick($event,'button.buttonID');" >{{button.label}}</button></div>
       </div>
       <div style="position:fixed;height:50px;bottom:0px;left:0px;right:0px;margin-bottom:0px"} ng-show="errorMessage != ''">
          <div class="col-sm-12">
           <h3 class="text-danger">{{errorMessage}}</h3>
         </div>
       </div>
     </div>
</div>
</body>
</html>
```

## The JavasScript

You will notice that the Angular template loads a javascript file named `click.js` (which I have included in the public subdirectory).  Most of this is boiler plate material... but notice how we use `$scope.` to make functionality defined in `click.js` available in our web-page.


```js
angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://146.57.34.125:1337'); //CHANGE for the lab!

function ButtonCtrl($scope,buttonApi){
   $scope.buttons=[]; //Initially all was still
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }
  function buttonClick($event){
     $scope.errorMessage='';
     buttonApi.clickButton($event.target.id)
        .success(function(){})
        .error(function(){$scope.errorMessage="Unable click";});
  }
  refreshButtons();  //make sure the buttons are loaded

}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    }
 };
}
```

For this week's lab I would like you to add the following functionality:

* Make the buttons fully functional
* Create a table for keeping track of the current transaction
* Add a list of some sort to your cash register to keep track of items that are part of the current transaction
* Add a total to the list (you can do this purely in javascript if you like)
* Add the ability to remove an item from your list by clicking on it.

You can look at my [online example](http://146.57.34.125:1337/listTest.html), to see what I'd like you to aim for.

Also be certain that you create a document detailing your API (include this in your repository) as well as your group members and database.

If you totally nail this you can begin preparing for next week by adding the ability to

* deal with allowing a user to log in and out,
* create a printable receipt (a javascript popup will suffice),
* create a "SALE" button, the infrastructure to support it, and implement the functionality,
* create a "VOID" button and implement the functionality.
