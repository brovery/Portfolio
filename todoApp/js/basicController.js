(function(){
    'use strict';

    angular.module('basicController', [])
        .controller('basicController', basicController);

    basicController.$inject = [];

    function basicController() {

        // list everything
        var bc = this;
        bc.shoppingLists = [];
        bc.listItems = [];
        bc.addList = addList;
        bc.addItem = addItem;

        // define functions
        function addList() {
            bc.shoppingLists.push({name: bc.listName});
            bc.listName = '';
            console.log(bc.shoppingLists);
        }

        function addItem() {
            bc.listItems.push({name: bc.itemName, qty: bc.itemQty});
            bc.itemName = '';
            bc.itemQty = '';
            console.log(bc.listItems);
        }
    }

}());
