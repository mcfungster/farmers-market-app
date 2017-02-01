// here is the controller for the admin login
angular.module('farmer.login', ['farmer.adminServices'])

.controller('LoginController', function($scope, $window, $location, Auth) {
  // here is the function for admin to submit their credentials for logging into admin page
  $scope.submit = () => {
    Auth.login({
      username: $scope.username,
      password: $scope.password
    })
    .then((token) => {
      // save the token that the server sends back in localStorage
      $window.localStorage.setItem('token', token);
      // $location.path('/adminUpdate'); // breaking this for now
      // $location.path('/map');          // changed for normal users
      $location.path('/adminUpdate'); // nevermind
    })
    .catch((err) => {
      console.error(err);
    });
  };
});
