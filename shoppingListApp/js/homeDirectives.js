(function(){
    'use strict';

    angular.module('homeDirectives', [])
        .directive('tdItem', tdItem)
        .directive('tdNonefound', tdNonefound)
        .directive('modal', showModal);

    function tdItem() {
        return {
            restrict: 'A',
            templateUrl: 'templates/tdItem.html'
        };
    }

    function tdNonefound() {
        return {
            restrict: 'A',
            template: '<td><i>No items in this list</i></td>'
        };
    }

    function showModal() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            templateUrl: '',
            link: function postLink(scope, element, attrs) {
                console.log("In the directive");
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value) {
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    }


}());
