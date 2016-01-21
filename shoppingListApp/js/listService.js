(function(){
    'use strict';

    angular.module('listService', ['ngStorage'])
        .service('listService', listService);

    listService.$inject = ['$localStorage', '$firebaseArray', '$firebaseObject'];

    function listService($localStorage, $firebaseArray, $firebaseObject) {
        var url = "https://blistering-heat-9918.firebaseio.com/shoppingList";
        var listref = new Firebase(url + "/Lists");
        var itemref = new Firebase(url + "/Items");

        // list everything
        var ls = this;
        ls.shoppingLists = $firebaseArray(listref);
        ls.listItems = $firebaseArray(itemref);
        ls.curList = 0;
        ls.listCount = 1;
        ls.itemId = 1;
        ls.addList = addList;
        ls.addItem = addItem;
        ls.changeList = changeList;
        ls.deleteItem = deleteItem;
        ls.deleteList = deleteList;
        ls.clearDone = clearDone;
        ls.toggleDone = toggleDone;
        ls.store = store;
        ls.editItem = editItem;


        // define functions
        function addList(listname) {
            //var dup = false;
            //for (var i = 0; i<ls.shoppingLists.length; i++) {
            //    if (listname == ls.shoppingLists[i]) {
            //        dup = true;
            //    }
            //}
            //if (dup == false) {
            //    ls.listCount++;
            //    ls.curList = ls.listCount-1;
            //    ls.shoppingLists.push(listname);
            //} else {
            //    alert("You cannot have duplicate list names. Please enter a valid list name.")
            //}
            //ls.store();
            ls.shoppingLists.$add({'listName': listname});
        }

        function addItem(name, qty) {
            if (qty == undefined) {
                qty = 0;
            }
            console.log(name + ", qty: " + qty);

            ls.listItems.$add({name: name, qty: qty, list: ls.curList, status: 0, id: ls.itemId});
            ls.itemId++;

            console.log(ls.listItems);

        }

        function changeList(cur) {
            ls.curList = cur;
            ls.store();
        }

        function deleteItem(id) {
            for (var i = 0; i<ls.listItems.length; i++) {
                if (ls.listItems[i].id === id) {
                    ls.listItems.splice(i, 1);
                    return;
                }
            }
            ls.store();
        }

        function deleteList(index) {
            //ls.shoppingLists.splice(index, 1);
            //ls.curList = 0;
            //for (var i = 0; i<ls.listItems.length; i++) {
            //    if (ls.listItems[i].list == index) {
            //        ls.listItems.splice(i, 1);
            //        i--;
            //    } else if (ls.listItems[i].list > index) {
            //        ls.listItems[i].list = ls.listItems[i].list-1;
            //    }
            //}
            //ls.store();
            ls.shoppingLists.$remove(index);
        }

        function clearDone() {
            // Clears the completed items from the items list for the currently-selected list.
            for (var i = 0; i<ls.listItems.length; i++) {
                if (ls.listItems[i].status == 1 && ls.listItems[i].list == ls.curList) {
                    ls.listItems.splice(i, 1);
                    i--;
                }
            }
            ls.store();
        }

        function toggleDone(name, list) {
            // Toggle status of an item.
            // Filter in html causes index to change, so this needs to loop through & find
            // the item by name. In case of same-name items on different lists, need to check list too.
            // TODO: Refactor this to use itemId instead of name/list.
            for (var i = 0; i<ls.listItems.length; i++) {
                if (ls.listItems[i].name == name && ls.listItems[i].list == list) {
                    if (ls.listItems[i].status == 0) {
                        ls.listItems[i].status = 1;
                    } else {
                        ls.listItems[i].status = 0;
                    }
                }
            }
            ls.store();
        }

        function editItem(id) {
            console.log("editing item: " + id);
        }

        function store() {
            //$localStorage.listCount = ls.listCount;
            //$localStorage.curList = ls.curList;
            //$localStorage.shoppingLists = ls.shoppingLists;
            //$localStorage.itemId = ls.itemId;
            //$localStorage.listItems = ls.listItems;

        }

        (function() {
            //if ($localStorage.listCount) {
            //    ls.listCount = $localStorage.listCount;
            //}
            //
            //if ($localStorage.curList) {
            //    ls.curList = $localStorage.curList;
            //}
            //
            //if ($localStorage.shoppingLists) {
            //    ls.shoppingLists = $localStorage.shoppingLists;
            //}
            //
            //if ($localStorage.itemId) {
            //    ls.itemId = $localStorage.itemId;
            //}
            //
            //if ($localStorage.listItems) {
            //    ls.listItems = $localStorage.listItems;
            //}
        })();
    }

}());
