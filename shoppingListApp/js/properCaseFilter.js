(function() {
    "use strict";

    angular
        .module('app.filters')
        .filter('properCase', properCase);

    function properCase() {
        return function(input) {
            var stuff = input.toLowerCase();
            stuff = stuff.charAt(0).toUpperCase() + stuff.slice(1);
            return stuff;
        }
    }
})();