(function(){
    'use strict';

    angular.module('listService', [])
        .service('listService', listService);

    listService.$inject = [];

    function listService() {

        // list everything
        var ls = this;
        ls.shoppingLists = ['All'];
        ls.listItems = [];
        ls.curList = 0;
        ls.listCount = 1;
        ls.addList = addList;
        ls.addItem = addItem;
        ls.removeList = removeList;
        ls.removeItem = removeItem;
        ls.changeList = changeList;
        ls.deleteItem = deleteItem;

        // define functions
        function addList(listname) {
            ls.listCount++;
            ls.curList = ls.listCount-1;
            ls.shoppingLists.push(listname);
            console.log(ls.shoppingLists);
        }

        function addItem(name, qty, list) {
            console.log(list);
            ls.listItems.push({name: name, qty: qty, list: ls.curList, status: 0});
            console.log(ls.listItems);
        }

        function changeList(cur) {
            console.log(cur);
            ls.curList = cur;
        }

        function deleteItem(index) {
            ls.listItems.splice(index, 1);
        }

        function removeList() {
            // TODO: Add functionality to remove a list.
        }

        function removeItem() {
            // TODO: Add functionality to remove an item from a list.
        }
    }

}());
