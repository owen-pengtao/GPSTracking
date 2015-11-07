angular.module('tracking.controllers', [])

.controller('LocationCtrl', function($scope, $timeout, $window, $q, $ionicLoading, $cordovaGeolocation, Location) {
    var frequencyMin = 10;
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
      $window.location.reload(true)
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

    $scope.intervalSend = function () {
      var d = new Date(),
        h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - (d.getMinutes() % frequencyMin)) + frequencyMin, 0, 0),
        e = h - d;
      $timeout($scope.intervalSend, e);
      if (d.getMinutes() % 5 === 0) {
        var time = Math.floor(d.getTime() / 1000);
        $scope._sendMyLocationFormatData(time, false);
      }
    };
    $scope.intervalSend();

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

.controller('syncCtrl', function($scope, Location) {
    $scope.sentLocations = Location.getSentLocations();
    $scope.lastSendLocation = _.last($scope.sentLocations) || [];

    $scope.unSentLocations = Location.getUnsentLocations();
    $scope.lastUnSendLocation = _.last($scope.unSentLocations) || [];

    $scope.syncMyLocation = function () {
      Location.sendMyLocation(null, true).then(function (data) {
        if (data.saved) {
          $scope.sentLocations = Location.saveSentLocations(data.currentData);
          $scope.lastSendLocation = _.last($scope.sentLocations);
        }else{
          $scope.unSentLocations = Location.saveUnsentLocations(data.currentData);
          $scope.lastUnSendLocation = _.last($scope.unSentLocations);
        }
      });
    };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
