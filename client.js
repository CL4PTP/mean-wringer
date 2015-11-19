(function() {
    'use strict';

    angular
    	.module('mw', []);

    //////////// ObjectList ////////////

    angular
        .module('mw')
        .controller('ObjectList', ObjectList);

    ObjectList.$inject = ['$scope'];

    function ObjectList($scope) {
    	$scope.objects = [
    		{ id: 1, type: 'Student' , attachable:true , name  :'Jim'     , degree: 'BSc' },
    		{ id: 1, type: 'Report'  , attachable:false, course:'Physics' , grade : 'A'   },
    		{ id: 2, type: 'Report'  , attachable:false, course:'Math'    , grade : 'B+'  },
    		{ id: 2, type: 'Student' , attachable:true , name  :'Sue'     , degree: 'BA'  },
    		{ id: 3, type: 'Report'  , attachable:false, course:'English' , grade : 'C'   },
    		{ id: 4, type: 'Report'  , attachable:false, course:'History' , grade : 'B-'  },
    		{ id: 5, type: 'Course'  , attachable:true , name  :'MEAN'    , desc  : 'Using the MEAN stack for web applications.' }
    	];
    }

    //////////// mwObject ////////////

    // Provide a way to add attachments to the
    // object by dragging & dropping files into
    // the .object div.

    angular
        .module('mw')
        .directive('mwObject', mwObject);

    function mwObject () {
        return {
        	templateUrl: 'object.html',
            controller: ObjectController,
            restrict: 'E',
            transclude:true,
            scope: {
            	object : '='
            }
        };
    }

	ObjectController.$inject = ['$scope'];

    function ObjectController ($scope) {
    	$scope.editing = false;
    	$scope.edit    = function () { $scope.editing = true;  };
    	$scope.save    = function () { $scope.editing = false; };
   	}

    //////////// mwLocking ////////////

	//
	//  Provide a directive that:
	//  o Adds the editing class & enables the element
	//    when object.editing is true
	//  o Removes the editing class & disabled the
	//    element when object.editing is false
    //

    angular
        .module('mw')
        .directive('mwLocking', mwLocking);

    function mwLocking () {
        return {
            restrict: 'A'
        };
    }

    //////////// mwAttachments ////////////

	//
	//  Provide a directive that:
	//  o lists an object's attachments, providing for each
	//    o a way to update & save the attachment name that
	//      is tied to the Edit/Save buttons in the mwObject
	//      directive
	//    o a way to delete the attachment
	//    o a way to open the attachment
	//    o a way to download the attachment
	//  o a way to open up a file list and add one or
	//    more files but does not display a 
	//    <input type='file'/> element
    //

    angular
        .module('mw')
        .directive('mwAttachments', mwAttachments);

    function mwAttachments () {
        return {
            restrict: 'E',
            scope: {
            	object : '='
            }
        };
    }

})();