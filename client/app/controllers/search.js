angular.module('farmer.search', ['farmer.services'])

.controller('SearchController', function ($scope, $location, $rootScope, Search, UserAuth) {
  $scope.address = '';
  $scope.radius = 2;
  $scope.submit = () => {
    console.log("Submission sent!")
    Search.search({ address: $scope.address, radius: $scope.radius })
    .then((results) => {
      $location.path('/map');
    })
    .catch(function (error) {
      console.error(error);
    });
  };
  const defaultBounds = new google.maps.LatLngBounds( new google.maps.LatLng(-33.8902, 151.1759), new google.maps.LatLng(-33.8474, 151.2631));
  const input = document.getElementById('searchTextField');
  const options = {
    bounds: defaultBounds,
  };

  $scope.autocomplete = new google.maps.places.Autocomplete(input, options);
  // Redirects user to admin login page
  $scope.redirectToAdminLogin = () => {
    $location.path('/adminLogin');
  }
  $scope.redirectToLogin = () => {
    $location.path('/login');
  }
  $scope.redirectToSignup = () => {
    $location.path('/signup');
  }
  $scope.redirectToProfile = () => {
    $location.path('/profile');
  }
  $scope.logout = () => {
    console.log('user.js LOGGING OUT');
    UserAuth.signout();
    $rootScope.user = undefined;
  }

});
