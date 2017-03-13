angular.module('farmer.userServices', [])

.factory('UserAuth', function($q, $timeout, $http) {
  var user = null;

  var isAuth = function() {
    console.log('userServices.js: isAuth()');
    var deferred = $q.defer();
    $http.get('/api/isAuth')
    .then(authorized => {
      console.log('authorized?', authorized);
      deferred.resolve(authorized);
    });
    return deferred.promise;
  }

  var getUserStatus = function() {
    console.log('userServices.js: getUserStatus()');
    return user;
  };

  var login = function(credentials) {
    console.log('userServices.js: login()', credentials);
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/login',
      data: {
        email: credentials.email,
        password: credentials.password
      }
    })
    .then(function(res) {
      var success = res.data.success;
      user = res.data.user

      console.log('$http.post success', success, res);
      console.log('$http.post success', res.data.success);
      deferred.resolve(user);
    })
    .catch(err => {
      console.log(err)
      deferred.reject(err);
    });
    console.log('returning deferred promise');
    return deferred.promise;
  };

  var signup = function(credentials) {
    console.log('userServices.js signup()', credentials);
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/signup',
      data: {
        email:    credentials.email,
        username: credentials.username,
        password: credentials.password
      }
    })
    .then(function(res) {
      var success = res.data.success;
      user = res.data.user

      // console.log('$http.post success', success, res);
      // console.log('$http.post success', res.data.success);
      deferred.resolve(user);
    })
    .catch(err => {
      console.log(err)
      deferred.reject(err);
    });
    // console.log('returning deferred promise');
    return deferred.promise;
  }

  var signout = function() {
    $http.get('/logout')
    .then(res => {
      console.log('logout api call response: ', res);
    })
    .catch();
  }

  return {
    isAuth: isAuth,
    getUserStatus: getUserStatus,
    login: login,
    signup: signup,
    signout: signout,
  }
});
