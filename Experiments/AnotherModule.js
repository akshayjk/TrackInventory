/**
 * Created by Akshay on 21-04-2015.
 */
var SomeFactory = angular.module('SomeFactory.service',[]);

SomeFactory.factory('feedFactory', ['$http', function(http){
    return {
        getFeed: http.get('/api/feed'),
        getUsers: http.get('/api/users')
    };
}])