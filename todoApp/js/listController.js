(function(){
    'use strict';

    angular.module('listController', [])
        .controller('listController', listController);

    listController.$inject = [];

    function listController() {

        // list everything
        var lc = this;
        lc.addItem = addItem;

        // define functions
        function addItem() {
            lc.itemName = 'list name';
            console.log(lc.itemName);
        }
    }

}());
