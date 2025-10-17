// AG-Grid API
let gridApi;
let selectedVolunteers = [];

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed
    columnDefs: [
        {
            headerName: '',
            field: 'volunteerId',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: 'left'
        },
        { field: "volunteerId", headerName: "Volunteer ID", filter: 'agTextColumnFilter', hide: true },
        { field: "studyId", headerName: "Study ID", filter: 'agTextColumnFilter', hide: true },
        {
            field: "flagColor",
            headerName: "",
            width: 50,
            cellRenderer: (params) => {
                if (params.value && params.value !== '' && params.value !== '#FFFFFF' && params.value !== 'white') {
                    return `<i class="bi bi-circle-fill" style="color: ${params.value};"></i>`;
                }
                return '';
            },
            sortable: false,
            filter: false
        },
        { field: "volunteerName", headerName: "Volunteer Name", filter: 'agTextColumnFilter', width: 200 },
        { field: "studyName", headerName: "Study Name", filter: 'agTextColumnFilter', width: 200 },
        {
            field: "preAssignedDate", headerName: "Pre-Assigned Date", filter: 'agTextColumnFilter', width: 150,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "subjectDOB", headerName: "Date of Birth", filter: 'agTextColumnFilter', width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        { field: "sex", headerName: "Sex", filter: 'agTextColumnFilter', width: 80 },
        { field: "race", headerName: "Race", filter: 'agTextColumnFilter', width: 120 },
        { field: "phone", headerName: "Phone", filter: 'agTextColumnFilter', width: 140 },
        { field: "ethnicity", headerName: "Ethnicity", filter: 'agTextColumnFilter', width: 130 },
        { field: "currentStatus", headerName: "Status", filter: 'agTextColumnFilter', width: 130 },
        { field: "notes", headerName: "Notes", filter: 'agTextColumnFilter', width: 200 },
        { field: "companyId", headerName: "Company", filter: true, hide: true },
        { field: "siteId", headerName: "Site", filter: true, hide: true },
        {
            field: "action",
            headerName: "Actions",
            width: 150,
            cellRenderer: (params) => {
                return `<button class="btn btn-sm btn-primary action-btn" data-volunteer-id="${params.data.volunteerId}" data-study-id="${params.data.studyId}">
                    <i class="bi bi-check-circle"></i> Complete
                </button>`;
            },
            sortable: false,
            filter: false
        }
    ],
    defaultColDef: {
        flex: 1,
        sortable: true,
        resizable: true
    },
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    onSelectionChanged: onSelectionChanged,
    enableAdvancedFilter: true,
    pagination: true,
};

// Initialize on document ready
$(function () {
    loadPreSelectedVolunteers();

    // Study filter change event
    $('#studyFilter').change(function() {
        loadPreSelectedVolunteers();
    });

    // Handle action button clicks
    $(document).on('click', '.action-btn', function(e) {
        e.preventDefault();
        const volunteerId = $(this).data('volunteer-id');
        const studyId = $(this).data('study-id');
        completePreAssignment(volunteerId, studyId);
    });
});

function loadPreSelectedVolunteers() {
    const studyId = $('#studyFilter').val();

    $.ajax({
        type: "POST",
        url: urlIndex,
        data: JSON.stringify({
            companyId: 1,
            siteId: 1,
            studyId: studyId ? parseInt(studyId) : null
        }),
        contentType: "application/json",
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            console.log('Pre-Selected Volunteers data:', data);
            setupGrid(data.data);
        },
        failure: function (response) {
            console.error('Failed to load pre-selected volunteers:', response);
            alert('Failed to load pre-selected volunteers');
        },
        error: function (response) {
            console.error('Error loading pre-selected volunteers:', response);
            alert('Error loading pre-selected volunteers');
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
    $('#totalCount').text(`${count} Candidate${count !== 1 ? 's' : ''}`);

    // Clear existing grid
    const gridDiv = document.querySelector("#preSelectedGrid");
    gridDiv.innerHTML = '';

    // Create new grid
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function onSelectionChanged() {
    selectedVolunteers = gridApi.getSelectedRows();
    console.log('Selected volunteers:', selectedVolunteers);
}

function completePreAssignment(volunteerId, studyId) {
    // TODO: Implement complete functionality later
    console.log('Complete pre-assignment for volunteer:', volunteerId, 'study:', studyId);
    alert(`Complete functionality for Volunteer ID ${volunteerId} and Study ID ${studyId} will be implemented later.`);
}
