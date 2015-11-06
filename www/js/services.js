angular.module('tracking.services', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    remove: function(key) {
      return $window.localStorage.removeItem(key);;
    }
  }
}])
.factory('Location', function($q, $localstorage){
    return {
      sendLocation: function(data, time){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      },
      //get locations that is not sent successful.
      getUnsentLocations: function(){
        var data = $localstorage.getObject("unSentLocations");
        if (_.isEmpty(data)) {
          data = [];
        }
        return data;
      },
      //save locations that is not sent successful.
      saveUnsentLocations: function(data){
        var unSendLocations = this.getUnsentLocations();
        unSendLocations.push(data);
        unSendLocations = _.uniq(unSendLocations, function(item) {
          return item.time;
        });
        $localstorage.setObject("unSentLocations", unSendLocations);
        return unSendLocations;
      },
      //remove locations that is not sent successful.
      removeUnsentLocations: function(){
        $localstorage.remove("unSentLocations");
      },
      //get locations that is sent successful.
      getSentLocations: function(){
        var data = $localstorage.getObject("sentLocations");
        if (_.isEmpty(data)) {
          data = [];
        }
        return data;
      },
      //save locations that is sent successful.
      saveSentLocations: function(data){
        var sentLocations = this.getSentLocations();
        sentLocations.push(data);
        sentLocations = _.uniq(sentLocations, function(item) {
          return item.time;
        });
        $localstorage.setObject("sentLocations", sentLocations);
        return sentLocations;
      },
      //reset localtions, only keep last 100 records
      resetSentLocationsFor100: function(){
        var sentLocations = window.localStorage.getItem("sentLocations") || [];
        sentLocations.slice(-100);
        $localstorage.setObject("sentLocations", sentLocations);
      },
      cleanLocations: function(){
        $localstorage.remove("unSentLocations");
        $localstorage.remove("sentLocations");
      }
    };
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
