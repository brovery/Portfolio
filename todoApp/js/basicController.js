(function(){
    'use strict';

    angular.module('basicController', [])
        .controller('basicController', basicController);

    basicController.$inject = [];

    function basicController() {

        // list everything
        var bc = this;
        bc.sometext = 'default value';
        bc.doSomething = doSomething;

        // define functions
        function doSomething() {
            bc.sometext = '';
        }
    }

}());
