var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();

  // This code runs whenever the user logs in
  $scope.logIn = function login(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/secretData',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          $scope.secretData = response.data;
        });
      });
    }else{
      console.log('Not logged in.');
      $scope.secretData = "Log in to get some secret data."
    }

  });

  // This code runs when the user logs out
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  };
});
