/**
 * Created by Ярик on 25.07.2016.
 */
/* App Module */
var storeApp = angular.module('storeApp', ['ngRoute', 'ngResource']);
//Routing
storeApp.config(['$routeProvider', function ($routeProvide) {
    $routeProvide
        .when('/', {
            templateUrl: 'template/home.html',
            controller: 'productsCtrl'
        })
        .when('/product/:Id', {
            templateUrl: 'template/product-detail.html',
            controller: 'productDetailCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
// Factory
storeApp.factory('Goods', [
    '$resource', function ($resource) {
        return $resource('/product/:Id', {
            Id: 'product',
            apiKey: 'someKeyThis'
        }, {
            update: {method: 'PUT', params: {Id: '@Id'}, isArray: true}
        });
    }
]);
storeApp
    .directive('loginForm', function () {
        return {
            restrict: "E",
            templateUrl: "template/login-form.html",
            controller: 'loginRegisterCtrl'
        }
    })
    .controller('loginRegisterCtrl', ['$scope', '$http',
        function ($scope, $http, $httpParamSerializerJQLike) {
            $scope.user = {username: "", password: ""};
            /*Switch form*/
            $scope.showLoginForm = function ($event) {
                $scope.showLoginLink = true;
                $event.preventDefault();
            };
            $scope.showRegisterForm = function ($event) {
                $scope.showLoginLink = false;
                $event.preventDefault();
            };
            /*User registration*/
            $scope.registration = function (e, user) {
                try {
                    $http({
                        method: 'POST',
                        url: $scope.host + '/api/register/',
                        paramSerializer: '$httpParamSerializerJQLike',
                        data: user
                    }).then(function (response) {
                        if (response.data.status == 201) {
                            $scope.user = {username: "", password: ""};
                            $scope.showLink = false;
                            alert('Successful registration');
                            $scope.setHideModal();
                        } else {
                            alert(response.data.message);
                        }
                    }, function (response) {
                        alert(response.data.message);
                    });
                } catch (e) {
                }
            };
            /*User login*/
            $scope.login = function (e, user) {
                try {
                    $http({
                        method: 'POST',
                        url: $scope.host + '/api/login/',
                        paramSerializer: '$httpParamSerializerJQLike',
                        data: user
                    }).then(
                        function (response) {
                            if (response.data.success == true) {
                                window.localStorage.setItem("user-login-token", response.data.token);
                                $scope.showLink = false;
                                alert('Successful login');
                                $scope.setHideModal();
                            } else {
                                alert(response.data.message);
                            }
                        }, function (response) {
                            alert(response.data.message);
                        });
                    $scope.user = {username: "", password: ""};
                } catch (e) {
                }
            };
        }]);