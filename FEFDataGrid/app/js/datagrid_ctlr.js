function DataGridController($scope, $http, $log) {
    'use strict';

    /**** Scope Properties ***/
    $scope.name = 'test';

    $scope.gridData = [];
    $scope.dataURL = null;
    $scope.currentSortField = undefined;
    $scope.currentSortAscending = undefined;
    
    // Set the DataTable ColumnDef Options
    $scope.columnDefs = [{ "bSortable": true }];


    /**** Scope Watches ***/


    /**** Scope Methods ***/
    $scope.refreshDataGrid = function(pageNumber, sortField, sortAscending)
    {
        var dataURL = "../data/datacollection.json";

        var sortFilter = '';

        // If a sort field has been specified, append the appropriate sort text to it.
        if(sortField !== undefined)
        {
            sortFilter = sortField + ' ' + (!sortAscending ? 'asc': 'desc');

            // For this example, we will simply append the sort logic to the query string.
            // Note that the static data file call ignores this parameter in this example.
            dataURL +='?sort=' + sortFilter;
        }

        // Execute the data call.
        // TODO: This should probably be a $resource so we can avoid the string manipulation above.
        $http.get(dataURL).success(function (data, status) {

            var columns = [];
            var column = {};

            angular.forEach(data.d.cols, function (value, key) {

                // Only render columns that are specified.
                if (!value.hidden) {

                    // Create a new column object.
                    column = {};

                    // Store the title in the object.
                    column.sTitle = value.header;
                    column.sWidth = value.width;
                    column.field = value.id;

                    // Store the object in the columns collection.
                    columns.push(column);
                }
            });

            // Store the columns collection in the public property.
            $scope.columnDefinitions = columns;

            // Store the grid data in the public property.
            $scope.gridData = data.d.dsOptions.data;

        }).
        error(function (data, status) {
            alert("Error! Status: " + status + " Data: " + data);
        });
   
    };

    // The double click handler to allow us to launch an app from the grid.
    // Note that double click will not work if editing is enabled as the row template changes
    // before the 2nd click can be registered.
    $scope.doubleClickHandler = function(task, index) {
        alert('Double Clicked Row: ' + index);
    };

    $scope.sortGrid = function(column) {
        $log.info( 'Sort Column: ' + column );

        // Iterate through the columns collection to identify the correct column.
        angular.forEach( $scope.columnDefinitions, function(value, key) {

            // Once the correct column is identified, extract the field name from the column object.
            if( value.sTitle === column)
            {
                // If the user has already sorted on this field, then they are switching the sort order.
                if($scope.currentSortField === value.field)
                {
                    $scope.currentSortAscending = (!$scope.currentSortAscending);
                }

                // Persist the sort field.
                $scope.currentSortField = value.field;

                // Refresh the data grid using the new sort field.
                $scope.refreshDataGrid($scope.currentPage, $scope.currentSortField, $scope.currentSortAscending);
            }
        });
    };


    /**** Initial Scope Method Calls ***/

    // Initialize the Grid Data array.
    $scope.refreshDataGrid($scope.currentPage, $scope.currentSortField, $scope.currentSortAscending);
}