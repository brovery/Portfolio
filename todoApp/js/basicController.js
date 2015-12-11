(function(){
    'use strict';

    angular.module('basicController', [])
        .controller('basicController', basicController);

    basicController.$inject = [];

    function basicController() {

        // list everything
        var bc = this;
        var shoppingLists = [];
        bc.listName = 'list name';
        bc.addList = addList;

        // define functions
        function addList() {
            shoppingLists.push(bc.listName);
            bc.listName = 'list name';
            console.log(shoppingLists);
        }
    }

}());
