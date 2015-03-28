angular.module('starter.controllers', [])
    .constant('API_URL', {
        login:      'http://thezombieinfection.com/api/login.php',
        stats:      'http://thezombieinfection.com/api/stats.php?playerid=',
        news:       'http://thezombieinfection.com/api/news.php',
        bugtracker: 'http://thezombieinfection.com/api/bugtracker.php',
        hive:       'http://vac.thezombieinfection.com/api/hive.php'
    })
    .controller('AppCtrl', function ($rootScope, $scope, $http, $state, $ionicModal, $ionicPopup, $ionicHistory, $localStorage, $timeout, API_URL) {
        $rootScope.vipGroups = [4,8,10,11,13,15,16,17,19];
        $rootScope.isVip = false;

        $scope.getVip = function () {
            if($rootScope.vipGroups.indexOf($rootScope.playerData.group_id) > -1) {
                $rootScope.isVip = true;
            }
        };

        $rootScope.playerRank = {
            name: '—',
            points: 0
        };

        // Get player rank
        $scope.getRank = function () {
            var rankPromise = $http.get(API_URL.stats + $rootScope.playerData.player_id);
            rankPromise.success(function (stats, status, headers, config) {
                var rank = {
                    name: "Ranger",
                    points: 0
                };

                if(rank.points <= stats.ranger) {
                    rank.name   = "Ranger";
                    rank.points = stats.ranger;
                }
                if(rank.points <= stats.outlaw) {
                    rank.name   = "Outlaw";
                    rank.points = stats.outlaw;
                }
                if(rank.points <= stats.hunter) {
                    rank.name   = "Hunter";
                    rank.points = stats.hunter;
                }
                if(rank.points <= stats.nomad) {
                    rank.name   = "Nomad";
                    rank.points = stats.nomad;
                }
                if(rank.points <= stats.survivalist) {
                    rank.name   = "Survivalist";
                    rank.points = stats.survivalist;
                }

                $rootScope.playerRank = rank;
            });
        };

        // Logout
        $scope.logout = function () {
            // Show confirmation
            var logoutConfirm = $ionicPopup.confirm({
                title: 'Logout?',
                template: 'Do you really want to log out?'
            });

            logoutConfirm.then(function (result) {
                if(result) {
                    $localStorage.set('loggedIn', null);
                    $localStorage.setObject('playerData', {});
                    $rootScope.loggedIn     = null;
                    $rootScope.playerData   = {};
                    $state.go('login');
                }
            });
        };

        // Initial functions
        $scope.init = function () {
            $scope.getRank();
            $scope.getVip();
        };
    })

    .controller('LoginCtrl', function ($rootScope, $scope, $state, $http, $ionicPopup, $ionicLoading, $ionicHistory, $localStorage, API_URL, transformRequestAsFormPost) {
        $scope.loginData = {};

        $scope.redirectAfter = function() {
            $state.go('app.news');
        };

        $scope.doLogin = function () {

            $ionicLoading.show();
            console.log('Logging in...', $scope.loginData);

            var loginPromise = $http.post(API_URL.login, $scope.loginData, {
                transformRequest: transformRequestAsFormPost
            });

            // Login succeeded
            loginPromise.success(function (data, status, headers, config) {
                if(typeof data.error != "undefined") {
                    $ionicLoading.hide();
                    // Show alert
                    $ionicPopup.alert({
                        title: "Houston, we have a problem",
                        template: "Your username or password is wrong.<br><br><small class='dark'>Note: Use your BP account</small>",
                        html: true
                    });
                    $localStorage.set('loggedIn', null);
                    $localStorage.setObject('playerData', {});
                    $rootScope.loggedIn     = null;
                    $rootScope.playerData   = {};
                    return false;
                }

                // Login successful

                $localStorage.set('loggedIn', true);
                $localStorage.setObject('playerData', data);
                $rootScope.loggedIn     = true;
                $rootScope.playerData   = data;
                $ionicLoading.hide();

                $scope.redirectAfter();
            });

            // Login failed
            loginPromise.error(function (data, status, headers, config) {
                $localStorage.set('loggedIn', null);
                $localStorage.setObject('playerData', {});
                $rootScope.loggedIn     = null;
                $rootScope.playerData   = {};
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: "Houston, we have a problem",
                    template: "We can not establish a connection. Are you connected to the internet?",
                    html: true
                });

            });
        }
    })

    .controller('ProfileCtrl', function ($scope, $rootScope, $ionicPopup, $http, API_URL, $ionicLoading) {
        $scope.playerData = $rootScope.playerData;


        $scope.playerStats = [{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},];

        // Get player statistics
        $scope.getPlayerStats = function () {
            $ionicLoading.show();
            var statPromise = $http.get(API_URL.stats + $rootScope.playerData.player_id);

            statPromise.success(function (stats, status, headers, config) {
                $scope.playerStats = [];

                angular.forEach(stats, function (stat, key) {
                    $scope.playerStats.push({
                        name: key.replace('_', ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), // Uppercase each word
                        value: stat
                    });
                });

                $ionicLoading.hide();
            });

            statPromise.error(function (data, status, headers, config) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: "Houston, we have a problem",
                    template: "We can not establish a connection. Are you connected to the internet?",
                    html: true
                });
            });
        };

        $scope.init = function () {
            $scope.getPlayerStats();
        };
    })

    .controller('HiveCtrl', function ($scope, $rootScope, $http, $ionicPopup, API_URL, $ionicLoading) {

        $scope.hiveStats = [{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},{name: "Loading", value: '...'},];

        // Get hive statistics
        $scope.getHiveStats = function () {
            $ionicLoading.show();
            var statPromise = $http.get(API_URL.hive);

            statPromise.success(function (stats, status, headers, config) {
                $scope.hiveStats = [
                    {name: 'ArmA 3 Version', value: stats.mod.arma3},
                    {name: 'Launcher Version', value: stats.mod.launcher},
                    {name: 'BP Version', value: stats.mod.mod}
                ];

                angular.forEach(stats.hive, function (stat, key) {
                    $scope.hiveStats.push({
                        name: key.replace('_', ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), // Uppercase each word
                        value: stat
                    });
                });

                $ionicLoading.hide();
            });

            statPromise.error(function (data, status, headers, config) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: "Houston, we have a problem",
                    template: "We can not establish a connection. Are you connected to the internet?",
                    html: true
                });
            });
        };

        $scope.doRefresh = function () {
            $scope.getHiveStats();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        $scope.init = function () {
            $scope.getHiveStats();
        };
    })

    .controller('BugtrackerCtrl', function ($scope, $rootScope, $http, $ionicLoading, API_URL) {

    })

    .controller('MapsCtrl', function ($scope, $rootScope, $http, $ionicLoading, API_URL) {

    })

    .controller('NewsCtrl', function ($scope, $rootScope, $localStorage, $http, $ionicLoading, API_URL) {
        $scope.news     = [];
        $scope.initial  = true;

        $scope.doRefresh = function () {
            $scope.getNews();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
        $scope.getNews = function () {
            if($scope.initial) {
                $ionicLoading.show();
            }
            var newsPromise = $http.get(API_URL.news);
            newsPromise.success(function (news, status, headers, config) {
                var id = 1;
                // Clear news
                $scope.news     = [];
                $rootScope.news = [];

                // Add news
                angular.forEach(news, function (newsItem) {
                    // Push to news items
                    $scope.news.push({
                        id: id,
                        title: newsItem.title,
                        time: new Date(newsItem.publishedDate),
                        content: newsItem.content
                    });
                    id++;
                });

                if($scope.initial) {
                    $ionicLoading.hide();
                }
                $rootScope.news = $scope.news;
                $scope.initial  = false;

                //Save to local storage
                $localStorage.setObject('news', $scope.news);
            });

            newsPromise.error(function (data, status, headers, config) {
                if($scope.initial) {
                    $ionicLoading.hide();
                }
                $scope.initial = false;
                $ionicPopup.alert({
                    title: "Houston, we have a problem",
                    template: "We can not establish a connection. Are you connected to the internet?",
                    html: true
                });
            });
        };

        // Initial functions
        $scope.init = function () {
            $scope.getNews();
        };
    })

    .controller('NewsItemCtrl', function ($scope, $rootScope, $stateParams) {
        $scope.newsItem = $rootScope.news[parseInt($stateParams.newsItemId) - 1];

    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggaes', id: 1},
            {title: 'Chill', id: 2}
        ];
    })


    // Transform to URL encoded form data
    .factory('transformRequestAsFormPost', function () {

        // Prepare request data for form post
        function transformRequest(data, getHeaders) {
            var headers = getHeaders();

            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

            return serializeData(data);
        }

        return transformRequest;

        // Private functions
        function serializeData(data) {
            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {
                return data == null ? "" : data.toString();
            }

            var buffer = [];

            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) +
                    "=" +
                    encodeURIComponent(( value == null ) ? "" : value)
                );
            }

            return buffer.join("&").replace(/%20/g, "+");
        }
    })
    .factory('$localStorage', ['$window', function($window) {
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
            }
        }
    }]);
