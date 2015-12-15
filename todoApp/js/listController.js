(function(){
    'use strict';

    angular.module('listController', [])
        .controller('listController', listController);

    listController.$inject = [];

    function listController() {

        // list everything
        var lc = this;
        lc.listItems = [{name: "steak"}, {name: "potato"}];
        lc.itemName = "add item";
        lc.addItem = addItem;

        // define functions
        function addItem() {
            lc.listItems.push({name: lc.itemName});
            console.log(lc.listItems);
        }
    }

}());
