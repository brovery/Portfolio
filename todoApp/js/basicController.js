(function () {
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
        bc.changeList = changeList;
        bc.deleteItem = deleteItem;

        // define functions
        function addList() {
            listService.addList(bc.listName);
            bc.listName = '';
        }

        function addItem() {
            listService.addItem(bc.itemName, bc.itemQty, bc.listName);
            bc.itemName = '';
            bc.itemQty = '';
        }

        function changeList(i) {
            bc.currentList = i;
            listService.changeList(i);
        }

        function deleteItem(i) {
            listService.deleteItem(i);
        }


    }

}());
