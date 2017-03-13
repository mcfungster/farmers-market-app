angular.module('farmer.map', ['farmer.services', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'farmer.userServices'])

.controller('MapController', function($scope, $location, $rootScope, Search, SampleData, GoogleMaps, $mdDialog, UserAuth) {
  $scope.address = ''; // Scope variable to store user address input
  $scope.radius = 2; // Scope variable to store search radius input

  $scope.submit = () => { // Sends search request to server
    console.log("Submission sent!")
    Search.search({
        address: $scope.address,
        radius: $scope.radius
      })
      .then((results) => {
        $scope.results = results;

        // Deletes markers currently on the map
        $scope.markers = GoogleMaps.Marker.deleteAll($scope.markers);

        // Adds markers from new results
        for (let i = 0; i < $scope.results.length; i++) {
          GoogleMaps.Marker.create($scope.map, $scope.markers, infoWindow, $scope.results[i]);
        }

        // Centers map view on new markers
        GoogleMaps.autoCenter($scope.map, $scope.markers);

        // allProducts = getProdList($scope.results);
        // console.log(allProducts);

      })
      .catch(function(error) {
        console.error(error);
      });
  };
  $scope.stop = function($event) {
    $event.stopPropagation();
  }
  $scope.selectedMarket = function(target) {
      console.log(target);
    }
    // AccordianCtrl.fetch($scope.results)
    // Functionality for search results

  const sampleData = SampleData.data;

  let storedResults = Search.retrieveResults(); // Pulls any stored results in Search factory

  console.log(storedResults);

  // Stores markets that return from the search requests on search.html or map.html pages
  $scope.results = storedResults.length !== 0 ? storedResults : sampleData;


  // Functionality for Google Map

  // Contains the configuration options used for creating a Google Map on page
  const mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(40.7058253, -74.1180872), // Filled in with coordinates for the center of NYC
    mapTypeControl: true,
    fullscreenControl: false,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  };

  // Stores an infoWindow object that pops up when the user clicks on a marker
  let infoWindow = new google.maps.InfoWindow();

  // Creates and stores a new Google Maps object on page
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Stores all the farmer marker's markers created based on search results
  $scope.markers = [];

  // Creates markers for sample data on initial page load (For Development Purposes)
  for (let i = 0; i < $scope.results.length; i++) {
    GoogleMaps.Marker.create($scope.map, $scope.markers, infoWindow, $scope.results[i]);
  }

  if ($scope.results.length !== 0) {
    GoogleMaps.autoCenter($scope.map, $scope.markers);
  }


  // Address Autocomplete Functionality

  // Sets geographic bounds for autocomplete address lookup
  const defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-33.8902, 151.1759), new google.maps.LatLng(-33.8474, 151.2631));
  // Finds element on page to associate autocomplete input funcationlity with
  const input = document.getElementById('searchTextField');
  // Autocomplete configuration options - see maps API docs for more info
  const options = {
    bounds: defaultBounds,
  };
  // Creates new autocomplete input object
  $scope.autocomplete = new google.maps.places.Autocomplete(input, options);


  // Functionality for autocomplete filter functionailty
  // This code that utlizes this functionality is currently commented out on the map.html page
  // This is related to creating autocomplete feature to help users filter different types of
  // producs they are looking for

  // This creates a chip object for a product type - See Angular Material Chip documentation - Refer to Custom Input example in Demo
  $scope.transformChip = (chip) => {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      return {
        name: chip,
        type: 'new'
      }
    }
    // Stores an array of unique product categories
    // let allProducts = getProdList($scope.results);
    // See Angular Material Chip documentation - Refer to Custom Input example in Demo for more info on the variables belwow
  $scope.selectedProducts = [];

  $scope.selectedItem = null;

  $scope.searchText = null;

  // Query function for string being typed into autocomplete filter input
  $scope.querySearch = (query) => {
    var results = query ? allProducts.filter(createFilterFor(query)) : [];
    return results;
  }

  // Create filter function for a query string
  let createFilterFor = (query) => {
    let lowercaseQuery = angular.lowercase(query);

    return function filterFn(product) {
      return product._lowerproduct.indexOf(lowercaseQuery) === 0;
    }
  }

  $scope.show = function(market, $event) {
    $mdDialog.show({
      targetEvent: $event,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'pop.html',
      clickOutsideToClose: true,
      controller: function DialogController($scope, $mdDialog) {
        var message = `Lets Meet Up! @ ${market.Name},
on ${market.Address}.`
        var counter = 0
        $scope.messageArr = [{
          id: counter,
          message,
          phoneNum: ''
        }];

        $scope.addMore = function($event) {
          counter++;
          $scope.messageArr.push({
            id: counter,
            message,
            phoneNum: ''
          });
          $event.preventDefault();
        }

        $scope.send = function() {
          Search.sendMessage($scope.messageArr);
          $mdDialog.hide();
        }
      }
    })
  }

  // Parses, checks and returns an array of unique product categories the results contain
  // The time complexity could be better on this function...
  function getProdList(markets) {
    let list = new Set();

    markets.forEach((market) => {
      console.log(market.Products)
      let products = market.Products.split(/\s*;\s*/);
      for (let product of products) {
        list.add(product);
      }
    });

    return [...list].map((product) => {
      let obj = {};
      obj.product = product;
      obj._lowerproduct = product.toLowerCase();
      return obj;
    });
  };

  $scope.login = (email, password) => {
    console.log('maps.js login()', email, password);
    $scope.error = false;

    UserAuth.login({email: email, password: password})
    .then(success => {
      console.log(success);
      if (success) {
        $rootScope.user = success;
      } else {
        $scope.error = true;
        $scope.errorMessage = "Invalid username or password"
      }
    })
    .catch();
  };



});
