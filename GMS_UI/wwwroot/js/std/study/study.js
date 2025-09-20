let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "code", filter: 'agTextColumnFilter' },
        { field: "sponsorId", filter: true, hide: true },
        { field: "name", filter: 'agTextColumnFilter' },
        { field: "description", filter: 'agTextColumnFilter' },
        { field: "notes", filter: 'agTextColumnFilter' },
        { field: "dateCreated", filter: true, hide: true },
        { field: "companyId", filter: true, hide: true },
        { field: "protocolId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
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
    gridApi = agGrid.createGrid(document.querySelector("#studyGrid"), gridOptions);
    //alert('done');
}
