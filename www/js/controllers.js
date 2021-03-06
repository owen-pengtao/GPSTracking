angular.module('tracking.controllers', [])

.controller('LocationCtrl', function($scope, $timeout, $window, $q, $ionicLoading, $cordovaGeolocation, Location) {

    $scope.mapInited = false;
    $scope.sentLocations = Location.getSentLocations();
    $scope.lastSendLocation = _.last($scope.sentLocations) || [];
    $scope.selectLocation = $scope.lastSendLocation;

    $scope.unSentLocations = Location.getUnsentLocations();
    $scope.lastUnSendLocation = _.last($scope.unSentLocations) || [];

    $scope.cleanLocations = function () {
      Location.cleanLocations();
      $scope.sentLocations = [];
      $scope.lastSendLocation = [];

      $scope.unSentLocations = [];
      $scope.lastUnSendLocation = [];
      $scope.mapInited = false;
    };
    $scope.refresh = function () {
      $window.location.reload(true);
    };

    $scope.initMyLocation = function () {
      $scope.mapInited = true;
      $timeout(function(){
        $scope.initMap();
        $scope._sendMyLocationFormatData();
      });
    };

    $scope._sendMyLocationFormatData = function () {
      Location.sendMyLocation(null, true).then(function(data){
        $scope.setMapPosition(data.currentData.position.lat, data.currentData.position.lng);
        if (data.saved) {
          $scope.sentLocations = Location.saveSentLocations(data.currentData);
          $scope.lastSendLocation = _.last($scope.sentLocations);
          $scope.selectLocation = $scope.lastSendLocation;
        }else{
          $scope.unSentLocations = Location.saveUnsentLocations(data.currentData);
          $scope.lastUnSendLocation = _.last($scope.unSentLocations);
        }
      }, function(err){
        console.log(err);
      });
    };



    $scope.setMapPosition = function(lat, lng){
      if($scope.map && $scope.mapMarker) {
        $scope.map.setCenter(new google.maps.LatLng(lat, lng));
        $scope.mapMarker.setPosition(new google.maps.LatLng(lat, lng));
      }
    };

    $scope.showLocation = function(location){
      if (location) {
        $scope.setMapPosition(location.position.lat, location.position.lng);
        $scope.lastSendLocation = location;
      }
    };

    $scope.findMe = function(){
      $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: true
      });
      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.setMapPosition(pos.coords.latitude, pos.coords.longitude);
        $ionicLoading.hide();
      });
    };

    $scope.initMap = function(lat, lng){
      lat = lat || 37.4071;
      lng = lng || -122.1444;
      var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      $scope.mapMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: $scope.map,
        title: "My Location"
      });
    };

    if ($scope.sentLocations.length) {
      $scope.initMap();
    }
})

.controller('syncCtrl', function($scope, $timeout, $window, $q, Location) {
    $scope.sentLocations = Location.getSentLocations();
    $scope.lastSendLocation = _.last($scope.sentLocations) || [];

    $scope.unSentLocations = Location.getUnsentLocations();
    $scope.lastUnSendLocation = _.last($scope.unSentLocations) || [];

    $scope._formatLocationData = function(data){
      if (data.saved) {
        $scope.sentLocations = Location.saveSentLocations(data.currentData);
        $scope.lastSendLocation = _.last($scope.sentLocations);
      }else{
        $scope.unSentLocations = Location.saveUnsentLocations(data.currentData);
        $scope.lastUnSendLocation = _.last($scope.unSentLocations);
      }
    };

    function onDeviceReady() {
      var bgGeo = window.BackgroundGeolocation;

      bgGeo.configure(function(location, taskId) {
        var data = {
          saved: false,
          currentData: {
            "time" : $scope.time,
            "position": {
              "lat": location.coords.latitude,
              "lng": location.coords.longitude
            }
          }
        };
        setTimeout(function() {
          $scope._formatLocationData(data);
          bgGeo.finish(taskId); // <-- execute #finish when your work in callbackFn is complete
        }, 1000);
      }, function(error) {
        console.log('BackgroundGeoLocation error');
      }, {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false
      });

      bgGeo.start();
    }

    var frequencyMin = 1;
    $scope.intervalSend = function () {
      var d = new Date(),
        h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - (d.getMinutes() % frequencyMin)) + frequencyMin, 0, 0),
        e = h - d;
      $timeout($scope.intervalSend, e);
      if (d.getSeconds() === 0) {
        $scope.time = Math.floor(d.getTime() / 1000);
        $scope.syncMyLocation($scope.time, true);
      }
    };
    $scope.intervalSend();

    $scope.refresh = function () {
      $window.location.reload(true);
    };
    $scope.syncMyLocation = function (time, backdrop) {
      Location.sendMyLocation(time, backdrop).then(function (data) {
        $scope._formatLocationData(data);
      });
    };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
