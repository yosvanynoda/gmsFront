let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        {
            field: "subjectCode",
            headerName: "Subject Code",
            filter: 'agTextColumnFilter',
            width: 140,
            valueGetter: (params) => {
                return params.data.subjectCode || params.data.SubjectCode || '';
            }
        },
        {
            field: "dateCreated", headerName: "Date Created", filter: 'agTextColumnFilter', width: 160,
            cellRenderer: (params) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `${dateStr} ${timeStr}`;
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
        {
            field: "randomCode",
            headerName: "Random Code",
            filter: 'agTextColumnFilter',
            width: 140,
            valueGetter: (params) => {
                return params.data.randomCode || params.data.RandomCode || '';
            }
        },
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
        { field: "subjectId", headerName: "Subject ID", filter: 'agTextColumnFilter', width: 120, hide: true },
        { field: "studyId", headerName: "Study ID", filter: 'agTextColumnFilter', hide: true },
        { field: "volunteerId", headerName: "Volunteer ID", filter: 'agTextColumnFilter', hide: true },
        {
            field: "action",
            headerName: "Actions",
            width: 220,
            cellRenderer: (params) => {
                return `<a href="/VLT/Volunteer/Edit?volunteerId=${params.data.volunteerId}&returnUrl=${encodeURIComponent('/SUB/Subject/Index')}" class="action-link" title="Edit Volunteer Data">
                    <i class="bi bi-person-fill text-info"></i>
                </a> |
                <a href="/SUB/Subject/Edit?subjectId=${params.data.subjectId}&returnUrl=${encodeURIComponent('/SUB/Subject/Index')}" class="action-link" title="Edit Subject Data">
                    <i class="bi bi-clipboard-data text-primary"></i>
                </a> |
                <a href="#" class="action-link randomize-link" data-subject-id="${params.data.subjectId}" data-study-id="${params.data.studyId}" title="Assign Random Code">
                    <i class="bi bi-shuffle text-success"></i>
                </a>`;
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
    enableAdvancedFilter: true,
    pagination: true,
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    loadSubjects();

    // Handle randomize action link clicks
    $(document).on('click', '.randomize-link', function(e) {
        e.preventDefault();
        const subjectId = $(this).data('subject-id');
        const studyId = $(this).data('study-id');

        // Get the row data from the grid
        const rowData = gridApi.getDisplayedRowAtIndex(
            gridApi.getDisplayedRowCount() - 1
        );

        // Find the subject data by searching through all rows
        let subjectData = null;
        gridApi.forEachNode(node => {
            if (node.data.subjectId === subjectId) {
                subjectData = node.data;
            }
        });

        if (subjectData) {
            showRandomCodeModal(subjectData);
        }
    });
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

function showRandomCodeModal(subjectData) {
    console.log('Show random code modal for subject:', subjectData);

    // Populate modal with subject information
    $('#randomSubjectName').text(`${subjectData.firstName} ${subjectData.lastName}`);
    $('#randomStudyName').text(subjectData.studyName);

    // Clear the random code input
    $('#randomCodeInput').val('');

    // Store IDs in hidden fields
    $('#randomCodeSubjectId').val(subjectData.subjectId);
    $('#randomCodeStudyId').val(subjectData.studyId);

    // Show the modal
    $('#randomCodeModal').modal('show');
}

function assignRandomCode() {
    const subjectId = $('#randomCodeSubjectId').val();
    const studyId = $('#randomCodeStudyId').val();
    const randomCode = $('#randomCodeInput').val().trim();

    console.log('Assign random code - SubjectId:', subjectId, 'StudioId:', studyId, 'Code:', randomCode);

    if (!subjectId || !studyId) {
        alert('Missing subject or study information');
        return;
    }

    if (!randomCode) {
        alert('Please enter a random code');
        $('#randomCodeInput').focus();
        return;
    }

    // Build request - API expects StudioId and Code, not StudyId and RandomCode
    const request = {
        SubjectId: parseInt(subjectId),
        StudioId: parseInt(studyId),
        Code: randomCode,
        CompanyId: 1
    };

    console.log('Random Code Request:', request);

    // Call page handler
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=CreateRandomCode',
        data: JSON.stringify(request),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken
        },
        success: function(response) {
            console.log('Create Random Code Response:', response);

            if (response.success) {
                alert(`Success! Random code assigned to Subject ID ${subjectId}.`);

                // Close the modal
                $('#randomCodeModal').modal('hide');

                // Reload the grid
                loadSubjects();
            } else {
                alert('Error assigning random code: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Create Random Code Error:', error);
            console.error('XHR Status:', xhr.status);
            console.error('XHR Response:', xhr.responseText);

            let errorMessage = 'Unknown error';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            } else {
                errorMessage = error;
            }

            alert('Error assigning random code: ' + errorMessage);
        }
    });
}
