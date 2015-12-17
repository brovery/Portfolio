(function(){
    'use strict';

    angular.module('basicController', [])
        .controller('basicController', basicController);

    basicController.$inject = ['listService'];

    function basicController(listService) {

        // list everything
        var bc = this;
        bc.shoppingLists = listService.shoppingLists;
        bc.listItems = listService.listItems;
        bc.currentList = listService.curList;
        bc.addList = addList;
        bc.addItem = addItem;
        bc.removeList = removeList;
        bc.removeItem = removeItem;
        bc.changeList = changeList;

        // define functions
        function addList() {
            listService.addList(bc.listName);
            bc.listName = '';
        }

        function addItem() {
            listService.addItem(bc.itemName, bc.itemQty, bc.listName);
            bc.itemName = '';
            bc.itemQty = '';


            //bc.listItems.push({name: bc.itemName, qty: bc.itemQty, list: bc.itemList});
            //console.log(bc.listItems);
        }

        function changeList() {
            listService.changeList(bc.currentList);
        }

        function removeList() {
            // TODO: Add functionality to remove a list.
        }

        function removeItem() {
            // TODO: Add functionality to remove an item from a list.
        }
    }

}());
