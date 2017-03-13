angular.module('farmer.user', ['farmer.userServices'])

.controller('UserController', function($scope, $window, $location, UserAuth) {
  $scope.login = () => {
    console.log('user.js userController', $scope.email, $scope.password);
    $scope.error    = false;
    $scope.disabled = true;

    UserAuth.login({
      email:    $scope.email,
      password: $scope.password
    })
    .then((success) => {
      // console.log('user.js UserAuth.login success?', success);
      if (success) {
        console.log('user.js UserAuth.login successful');
        $location.path('/map');
        $scope.disabled = false;
        $scope.email = '';
        $scope.password = '';
      } else {
        // $location.path('/');
        console.log('user.js UserAuth.login error');
        $scope.error = true;
        $scope.errorMessage = "Invalid username or password"
        $scope.disabled = false;
        $scope.email = '';
        $scope.password = '';
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }
  $scope.signup = () => {
    UserAuth.signup({
      email:    $scope.email,
      username: $scope.username,
      password: $scope.password
    })
    .then((success) => {
      // console.log('user.js UserAuth.signup success?', success);
      if (success) {
        console.log('user.js UserAuth.signup successful');
        $location.path('/map');
        $scope.disabled = false;
        $scope.email = '';
        $scope.username = '';
        $scope.password = '';
      } else {
        // $location.path('/');
        console.log('user.js UserAuth.signup error');
        $scope.error = true;
        $scope.errorMessage = "Invalid username or password"
        $scope.disabled = false;
        $scope.email = '';
        $scope.username = '';
        $scope.password = '';
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }


});
