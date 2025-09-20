let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "volunteerId", filter: 'agTextColumnFilter', hide: true },
        { field: "firstName", filter: 'agTextColumnFilter' },
        { field: "lastName", filter: 'agTextColumnFilter' },
        {
            field: "subjectDOB", filter: 'agTextColumnFilter',
            cellRenderer: (data) => {
                return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
        },
        { field: "sex", filter: 'agTextColumnFilter' },
        { field: "race", filter: 'agTextColumnFilter' },
        { field: "phone", filter: 'agTextColumnFilter' },
        { field: "ethnicity", filter: 'agTextColumnFilter' },
        { field: "currentStatus", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
    ],
    defaultColDef: {
        flex: 1,
    },
    enableAdvancedFilter: true,
    pagination: true,
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    /*console.log("The DOM is fully loaded!");*/
    // Your code here

    $.ajax({
        type: "POST",
        url: urlIndex,
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {


            setupGrid(data.data);

        },
        failure: function (response) {
            alert('fail');
        },
        error: function (response) {
            alert('fail');
        }
    });
});

function setupGrid(data) {
    //console.log(data);
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#volunteerGrid"), gridOptions);
    //alert('done');
}
