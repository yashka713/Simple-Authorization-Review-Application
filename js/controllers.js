'use strict';

/* Controllers */

//Init products Controller
storeApp.controller('productsCtrl', [
    '$scope', '$http',
    function ($scope, $http) {
        /*get data from localStorage*/
        var tokenFromStorage = window.localStorage.getItem("user-login-token");
        if (( tokenFromStorage != 'undefined') &&
            (tokenFromStorage != undefined) &&
            (tokenFromStorage != 'null') &&
            (tokenFromStorage != '') &&
            (tokenFromStorage != null)) {
            $scope.showLink = false;
        }else {
            $scope.showLink = true;
        }
        $scope.setShowModal = function($event){
            $scope.showModal = true;
            $event.preventDefault();
        };
        $scope.setHideModal = function($event){
            $scope.showModal = false;
            return false;
        };

        $scope.host = 'http://smktesting.herokuapp.com';
        $scope.username = '';
        try {
            $http({
                method: 'Get',
                url: $scope.host + '/api/products'
            }).success(function (data) {
                $scope.products = data;
            });
        } catch (e) {
        }
        $scope.logout = function($event){
            window.localStorage.setItem("user-login-token", null);
            $scope.showLink = true;
            $event.preventDefault();
        };
    }]);

//Products Detail Controller
storeApp.controller('productDetailCtrl', ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {
        $scope.Id = $routeParams.Id;
        $scope.myReview = {rate: "", text: ""};
        $scope.arrStars = ["Horrible", "Not recommend", "Bad Shop", "Middle quality Shop", "Good Shop", "Best Shop"];

        /*get product*/
        $http({
            method: 'Get',
            url: $scope.host + '/api/products/'
        }).success(function (data) {
            $scope.product = data[$scope.Id - 1];
        });
        /*get comment*/
        $http({
            method: 'Get',
            url: $scope.host + '/api/reviews/' + $scope.Id
        }).success(function (data) {
            $scope.reviews = data;
        });
        /*send comment*/
        $scope.sendReview = function (e, myReview) {
            var token = window.localStorage.getItem("user-login-token");

            $http({
                method: 'POST',
                url: $scope.host + "/api/reviews/" + $scope.product.id,
                headers: {'Authorization': "Token " + token},
                data: myReview
            }).then(function (response) {
                if(response.data.success == true){
                    alert('Review added!');
                }
            }, function (response) {
                if (response.status === 401) {
                    alert(response.data.detail);
                }
                if (response.status===500) {
                    alert('Please, rate!');
                }
            });
            $http({
                method: 'Get',
                url: $scope.host + '/api/reviews/' + $scope.Id
            }).success(function (data) {
                $scope.reviews = data;
            });
        };
    }]);