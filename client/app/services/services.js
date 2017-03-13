angular.module('farmer.services', [])

// Creates factory with methods for search requests
.factory('Search', function($http) {
  // Stores markets returned from search requests to be used across controllers
  let searchResults = [];

  // Search request function
  const search = (params) => {
    // Creates a http promise that sends an address string and radius #
    return $http({
        method: 'GET',
        url: '/api/search',
        params: {
          address: params.address,
          radius: params.radius
        }
      })
      .then(function(response) {
        console.log('response data', response);
        // Saves results to interal variable
        searchResults = response.data;
        return response.data;
      })
  };

  const sendNewComment = newCommentObject => {
    return $http({
      method: 'POST',
      url: '/api/createComment',
      data: newCommentObject
    })
      .then(response => {
        console.log(response)
        return response.data
      })
      .catch(err => console.error('sendNewComment failed!  ', err))
  }

  // Retrives stored search results to be used in a controller
  const retrieveResults = () => {
    return searchResults;
  }
  const sendMessage = (Arr) => {
    return $http({
      method: 'POST',
      url: '/message',
      data: Arr
    })
  }
  return {
    search: search,
    retrieveResults: retrieveResults,
    sendMessage,
    sendNewComment
  }
})

.factory('Add', function($http) {
  const add = (market) => {
    return $http({
        method: 'POST',
        url: '/api/add',
        data: {
          marketData: market
        }
      })
      .then(function() {
        console.log('successful post to server');
      })
      .catch(function(err) {
        console.error(err);
      });
  }
})

.factory('SampleData', function() {

  const sampleData = [{
      "Address": "St. James Church, 391 Delaware Ave,, Albany, New York",
      "GoogleLink": "http://maps.google.com/?q=40.5767%2C%20-73.9839%20(%22Delaware+Area+Neighborhood+Farmers+Market%22)",
      "Products": "",
      "Schedule": "",
      "Lat": 40.5767,
      "Long": -73.9839,
      "Name": "Delaware Area Neighborhood Farmers Market",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.9839, 40.5767]
      }
    },
    {
      "Address": "WEST 16 STREET SURF AVE, BROOKLYN, New York, 11224",
      "GoogleLink": "http://maps.google.com/?q=40.581106%2C%20-73.983650%20(%22Coney+Island+Farmers+Market%22)",
      "Products": "Cut flowers; Eggs; Fresh fruit and vegetables; Fresh and/or dried herbs; Honey; Maple syrup and/or maple products; Plants in containers",
      "Schedule": "06/15/2014 to 10/26/2014 Sun: 8:00 AM-3:30 PM",
      "Lat": 40.581106,
      "Long": -73.98365,
      "Name": "Coney Island Farmers Market",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.98365, 40.581106]
      }
    },
    {
      "Address": "18th Ave between 81st & 82nd Streets, Brooklyn, New York, 11214",
      "GoogleLink": "http://maps.google.com/?q=40.6155350%2C%20-74.0109559%20(%22Bensonhurst%22)",
      "Products": "Baked goods; Fresh fruit and vegetables; Honey",
      "Schedule": "07/07/2013 to 11/23/2013 Sun: 9:00 AM-4:00 PM",
      "Lat": 40.615535,
      "Long": -74.0109559,
      "Name": "Bensonhurst",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0109559, 40.615535]
      }
    }
  ];

  return {
    data: sampleData
  }
})

// Methods to use Google Maps API
.factory('GoogleMaps', function() {

  const Marker = {
    // Sets the map on all markers in the markers array
    setMapOnAll: (map, storage) => {
      for (let i = 0; i < storage.length; i++) {
        storage[i].setMap(map);
      }
    },

    // Removes the markers from the map, but keeps them in the array
    clearAll: (storage) => {
      Marker.setMapOnAll(null, storage);
    },

    // Deletes all markers in the array by removing references to them.
    deleteAll: (storage) => {
      Marker.clearAll(storage);
      storage = [];
      return storage;
    },

    // Creates a marker and inserts in the storage array
    create: (map, storage, infoWindow, market) => {
      let marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(market.geometry.coordinates[1], market.geometry.coordinates[0]),
        title: market.Name
      })

      // Defines HTML and styling for marker infoboxes
      marker.content = '<div class="infoWindowContent">' +
        '<h3>' + market.Name + '</h3>' +
        '<h4> Schedule </h4>' +
        '<p>' + market.Schedule + '</p>' +
        '<h4> Products </h4>' +
        '<p>' + market.Products + '</p>' +
        '<a href=' + market.GoogleLink + ' target="_blank">Google Maps Link</a>';

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.setContent(marker.content);
        infoWindow.open(map, marker);
      });

      storage.push(marker);
    }
  };

  // Zoom and centers map around all markers in storage
  const autoCenter = (map, storage) => {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < storage.length; i++) {
      console.log(storage[i].getPosition().lng())
      bounds.extend(storage[i].position);
    }
    map.fitBounds(bounds);
    map.panToBounds(bounds);
  }

  return {
    Marker: Marker,
    autoCenter: autoCenter
  };
})
