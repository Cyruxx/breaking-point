// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })


            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.news', {
                url: "/news",
                views: {
                    'menuContent': {
                        templateUrl: "templates/news.html",
                        controller: "NewsCtrl"
                    }
                }
            })

            .state('app.newsitem', {
                url: "/news/:newsItemId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/news-item.html",
                        controller: "NewsItemCtrl"
                    }
                }
            })

            .state('app.hive', {
                url: "/hive",
                views: {
                    'menuContent': {
                        templateUrl: "templates/hive.html",
                        controller: "HiveCtrl"
                    }
                }
            })

            .state('app.bugtracker', {
                url: "/bugtracker",
                views: {
                    'menuContent': {
                        templateUrl: "templates/bugtracker.html",
                        controller: "BugtrackerCtrl"
                    }
                }
            })
            
            .state('app.maps', {
                url: "/maps",
                views: {
                    'menuContent': {
                        templateUrl: "templates/maps.html",
                        controller: "MapsCtrl"
                    }
                }
            })

            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news');
    })
    .run(function ($rootScope, $location, $localStorage) {
        $rootScope.$on('$stateChangeStart', function (event, next, current) {
            $rootScope.loggedIn     = $localStorage.get('loggedIn');
            $rootScope.playerData   = $localStorage.getObject('playerData');
            $rootScope.news         = $localStorage.getObject('news');

            if($rootScope.loggedIn == null || $rootScope.loggedIn == 'null') {
                // No logged in user, redirect to login
                if(next.templateUrl !== 'partials/login.html') {
                    $location.path('/login');
                }
            }
        });
    });
