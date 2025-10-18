let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "subjectId", headerName: "Subject ID", filter: 'agTextColumnFilter', width: 120 },
        {
            field: "dateCreated", headerName: "Date Created", filter: 'agTextColumnFilter', width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        { field: "studyName", headerName: "Study Name", filter: 'agTextColumnFilter', width: 200 },
        { field: "firstName", headerName: "First Name", filter: 'agTextColumnFilter', width: 150 },
        { field: "lastName", headerName: "Last Name", filter: 'agTextColumnFilter', width: 150 },
        {
            field: "subjectDOB", headerName: "Date of Birth", filter: 'agTextColumnFilter', width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        { field: "currentStatus", headerName: "Status", filter: 'agTextColumnFilter', width: 120 },
        { field: "randomCode", headerName: "Random Code", filter: 'agTextColumnFilter', width: 140 },
        {
            field: "ramdoDate", headerName: "Randomization Date", filter: 'agTextColumnFilter', width: 160,
            cellRenderer: (params) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                // Check if it's a valid date and not the default "0001-01-01"
                if (date.getFullYear() > 1900) {
                    return date.toLocaleDateString();
                }
                return '';
            }
        },
        { field: "studyId", headerName: "Study ID", filter: 'agTextColumnFilter', hide: true }
    ],
    defaultColDef: {
        flex: 1,
        sortable: true,
        resizable: true
    },
    enableAdvancedFilter: true,
    pagination: true,
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    loadSubjects();
});

function loadSubjects() {
    $.ajax({
        type: "POST",
        url: urlIndex,
        contentType: "application/json",
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            console.log('Subject List data:', data);
            setupGrid(data.data);
        },
        failure: function (response) {
            console.error('Failed to load subjects:', response);
            alert('Failed to load subjects');
        },
        error: function (response) {
            console.error('Error loading subjects:', response);
            alert('Error loading subjects');
        }
    });
}

function setupGrid(data) {
    console.log('Grid data received:', data);
    if (data && data.length > 0) {
        console.log('First record sample:', data[0]);
    }
    gridOptions.rowData = data;

    // Update count badge
    const count = data ? data.length : 0;
    $('#totalCount').text(`${count} Subject${count !== 1 ? 's' : ''}`);

    // Clear existing grid
    const gridDiv = document.querySelector("#subjectGrid");
    gridDiv.innerHTML = '';

    // Create new grid
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
}
