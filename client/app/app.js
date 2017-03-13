angular.module('farmer', [
  'xeditable',                  'farmer.search', 'farmer.services',
  'farmer.adminServices',       'farmer.map',    'farmer.login',
  'farmer.adminUpdate',         'farmer.user',   'farmer.userServices',
  'farmer.accordianController', 'ngMaterial',    'ngRoute',
  'ngAnimate'
])
.config(($routeProvider, $httpProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/search.html',
      controller: 'SearchController'
    })
    .when('/map', {
      templateUrl: 'app/views/map.html',
      controller: 'MapController',
    })
    .when('/adminUpdate', {
      templateUrl: 'app/views/adminSubmit.html',
      controller: 'AdminController',
      authenticate: true
    })
    .when('/adminLogin', {
      templateUrl: 'app/views/adminLogin.html',
      controller: 'LoginController',
    })
     /*********************************************/
    /** new routes with addition of passportjs  **/
    .when('/login', {
      templateUrl: 'app/views/userLogin.html',
      controller: 'UserController',
    })
    .when('/signup', {
      templateUrl: 'app/views/userSignup.html',
      controller: 'UserController',
    })
    .when('/logout', {
      controller: 'UserController',
    })
    .when('/profile', {
      templateUrl: 'app/views/userProfile.html',
      controller: 'UserController',
      authenticate: true
    })
    // end of new routes

    .otherwise({
      redirectTo: '/'
    });

    // an $httpProvider interceptor is added to all request calls so that all outgoing $http requests have the token attached
    // $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function($window) {
  var attach = {
    request: function(object) {
      var jwt = $window.localStorage.getItem('token');
      if(jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function($rootScope, $location, UserAuth) {
  // listen for when user wants to make a route change
  // make sure to send the token to the server with the route change request
  // redirect to admin login for the route(s) that require an 'authenticate'
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    console.log('route change triggered');
    UserAuth.isAuth().then(authorized => {
      console.log('front-end auth', authorized);
      if (next.$$route && next.$$route.authenticate && !authorized.data) {
        $location.path('/login');
      } else {
        $rootScope.user = authorized.data;
        console.log('rootScope user: ', $rootScope.user);
      }
    })
  });
});
