angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('registerApi',registerApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,registerApi){
   $scope.buttons=[]; //Initially all was still
   $scope.cart=[];

   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.refreshCart=refreshCart;
   $scope.rowClick=rowClick;
   $scope.buttonClick=buttonClick;
   $scope.total = function(items,prop){return (items.reduce(function(a,b){return Number(a)+Number(b[prop]);},0)).toFixed(2);};


    var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getButtons()
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
     registerApi.clickButton($event.target.id)
        .success(function(){ refreshCart() })
        .error(function(){$scope.errorMessage="Unable click";});
  }

  function refreshCart() {
      loading = true;
      $scope.errorMessage = '';
      registerApi.getCart()
          .success(function (data) {
              $scope.cart = data;
              loading = false;
          })
          .error(function () {
              $scope.errorMessage = "Unable to load Cart: Database request failed";
          })
  }

  function rowClick($event) {
      $scope.errorMessage='';
      registerApi.clickRow($event.srcElement.parentElement.id-100)
          .success(function(){ refreshCart() })
          .error(function(){
              $scope.errorMessage = "Unable to delete item from cart: Database request failed";
          })
  }

  refreshCart(); //make sure the cart is loaded
  refreshButtons();  //make sure the buttons are loaded
}

function registerApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    getCart: function(){
        var url = apiUrl+'/list';
        return $http.get(url);
    },
    clickRow: function (id) {
        var url = apiUrl+'/delete?id='+id;
        console.log('attempting to delete item'+id);
        return $http.get(url);
    }
  };
}

