/**
 * Created by Akshay on 20-04-2015.
 */

//var LeWebAppServices = angular.module('LEServices', []);

LeWebApp.factory('loginService', ['$http', '$q', '$timeout', '$location', '$log', function ($http, $q, $timeout, $location, $log) {
    return {
        login : function (data) {
            var config = {method: 'GET', url: 'http://localhost:8090/restjson'}
            return $http(config);
        }
    }
}]);
