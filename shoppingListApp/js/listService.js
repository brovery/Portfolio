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
        ls.changeList = changeList;
        ls.deleteItem = deleteItem;
        ls.deleteList = deleteList;
        ls.clearDone = clearDone;
        ls.toggleDone = toggleDone;

        // define functions
        function addList(listname) {
            ls.listCount++;
            ls.curList = ls.listCount-1;
            ls.shoppingLists.push(listname);
        }

        function addItem(name, qty, list) {
            ls.listItems.push({name: name, qty: qty, list: ls.curList, status: 0});
        }

        function changeList(cur) {
            ls.curList = cur;
        }

        function deleteItem(index) {
            ls.listItems.splice(index, 1);
        }

        function deleteList(index) {
            ls.shoppingLists.splice(index, 1);
            ls.curList = 0;
            for (var i = 0; i<ls.listItems.length; i++) {
                if (ls.listItems[i].list == index) {
                    ls.listItems.splice(i, 1);
                    i--;
                } else if (ls.listItems[i].list > index) {
                    ls.listItems[i].list = ls.listItems[i].list-1;
                }
            }
        }

        function clearDone() {
            // Clears the completed items from the items list for the currently-selected list.
            for (var i = 0; i<ls.listItems.length; i++) {
                if (ls.listItems[i].status == 1) {
                    ls.listItems.splice(i, 1);
                    i--;
                }
            }
        }

        function toggleDone(index) {
            if (ls.listItems[index].status == 0) {
                ls.listItems[index].status = 1;
            } else {
                ls.listItems[index].status = 0;
            }
        }
    }

}());
