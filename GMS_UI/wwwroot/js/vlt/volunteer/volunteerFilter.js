// AG-Grid API
let gridApi;
let selectedVolunteers = [];

// Initialize on document ready
$(document).ready(function() {
    // Setup event listeners
    $('#searchBtn').click(performSearch);
    $('#clearBtn').click(clearFilters);
    $('#preAssignBtn').click(preAssignVolunteers);
});

// Perform volunteer search
function performSearch() {
    // Validate study selection (required for pre-assignment, but optional for search)
    const studyId = parseInt($('#studyId').val()) || null;

    // Build search request - ensure empty values are sent as null, not 0
    const minAge = $('#minAge').val();
    const maxAge = $('#maxAge').val();
    const genderId = $('#genderId').val();
    const raceId = $('#raceId').val();
    const ethnicityId = $('#ethnicityId').val();
    const languageId = $('#languageId').val();
    const currentStatus = $('#currentStatus').val();

    const searchRequest = {
        CompanyId: 1,
        SiteId: 1,
        MinAge: minAge && minAge !== '' ? parseInt(minAge) : null,
        MaxAge: maxAge && maxAge !== '' ? parseInt(maxAge) : null,
        GenderId: genderId && genderId !== '' ? parseInt(genderId) : null,
        RaceId: raceId && raceId !== '' ? parseInt(raceId) : null,
        EthnicityId: ethnicityId && ethnicityId !== '' ? parseInt(ethnicityId) : null,
        LanguageId: languageId && languageId !== '' ? parseInt(languageId) : null,
        CurrentStatus: currentStatus && currentStatus !== '' ? currentStatus : null,
        ExcludeAlreadyAssigned: $('#excludeAlreadyAssigned').is(':checked'),
        StudyId: studyId
    };

    console.log('Search Request:', searchRequest);

    // Show loading state
    $('#searchBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Searching...');

    // Call search API
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=Search',
        data: JSON.stringify(searchRequest),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            console.log('=== AJAX SUCCESS ===');
            console.log('Full response:', response);
            console.log('Response type:', typeof response);
            console.log('Response.success:', response.success);
            console.log('Response.message:', response.message);
            console.log('Response.data:', response.data);
            console.log('Response.data type:', typeof response.data);
            console.log('Response.data is Array:', Array.isArray(response.data));

            if (response.success) {
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        if (response.data.length > 0) {
                            console.log('Calling displaySearchResults with', response.data.length, 'items');
                            displaySearchResults(response.data);
                        } else {
                            alert('No volunteers found matching the criteria.');
                            $('#resultsSection').hide();
                        }
                    } else {
                        console.error('Data is not an array! Type:', typeof response.data);
                        console.error('Data value:', response.data);
                        alert('Error: Data format is incorrect. Expected array but got ' + typeof response.data);
                        $('#resultsSection').hide();
                    }
                } else {
                    console.error('response.data is null or undefined');
                    alert('No data returned from server.');
                    $('#resultsSection').hide();
                }
            } else {
                alert('Search failed: ' + (response.message || 'Unknown error'));
                $('#resultsSection').hide();
            }

            // Reset button
            $('#searchBtn').prop('disabled', false).html('<i class="bi bi-search"></i> Search Volunteers');
        },
        error: function(xhr, status, error) {
            console.error('Search Error:', error);
            console.error('XHR Status:', xhr.status);
            console.error('XHR Response:', xhr.responseText);
            console.error('Status:', status);

            let errorMessage = 'Unknown error';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            } else {
                errorMessage = error;
            }

            alert('Error searching volunteers: ' + errorMessage);

            // Reset button
            $('#searchBtn').prop('disabled', false).html('<i class="bi bi-search"></i> Search Volunteers');
        }
    });
}

// Display search results in AG-Grid
function displaySearchResults(data) {
    console.log('=== DISPLAY SEARCH RESULTS ===');
    console.log('Data received:', data);
    console.log('Data length:', data.length);
    console.log('First item:', data[0]);

    const firstItemKeys = data[0] ? Object.keys(data[0]).join(', ') : 'no data';
    console.log('First item keys:', firstItemKeys);

    // Show results section
    $('#resultsSection').show();
    $('#resultsCount').text(`${data.length} volunteer(s) found`);

    // Setup grid column definitions
    const columnDefs = [
        {
            headerName: '',
            field: 'volunteerId',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: 'left'
        },
        {
            headerName: 'ID',
            field: 'volunteerId',
            width: 80,
            pinned: 'left'
        },
        {
            headerName: 'Subject ID',
            field: 'subjectId',
            width: 120
        },
        {
            headerName: 'First Name',
            field: 'firstName',
            width: 130
        },
        {
            headerName: 'Last Name',
            field: 'lastName',
            width: 130
        },
        {
            headerName: 'Age',
            field: 'age',
            width: 80
        },
        {
            headerName: 'DOB',
            field: 'subjectDOB',
            width: 120,
            valueFormatter: params => {
                if (!params.value) return '';
                const date = new Date(params.value);
                return date.toLocaleDateString();
            }
        },
        {
            headerName: 'Gender',
            field: 'gender',
            width: 100
        },
        {
            headerName: 'Race',
            field: 'race',
            width: 120
        },
        {
            headerName: 'Ethnicity',
            field: 'ethnicity',
            width: 130
        },
        {
            headerName: 'Language',
            field: 'language',
            width: 120
        },
        {
            headerName: 'Status',
            field: 'currentStatus',
            width: 130
        },
        {
            headerName: 'Phone',
            field: 'phone',
            width: 140
        },
        {
            headerName: 'Email',
            field: 'subjectEmail',
            width: 200
        },
        {
            headerName: 'Already Assigned',
            field: 'isAssignedToStudy',
            width: 140,
            cellRenderer: params => {
                if (params.value === true) {
                    return '<span class="badge bg-warning text-dark">Yes</span>';
                } else {
                    return '<span class="badge bg-success">No</span>';
                }
            }
        }
    ];

    // Grid options
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true
        },
        onSelectionChanged: onSelectionChanged,
        domLayout: 'normal'
    };

    // Clear existing grid
    const gridDiv = document.querySelector('#volunteersGrid');
    gridDiv.innerHTML = '';

    // Create new grid
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
}

// Handle selection change
function onSelectionChanged() {
    selectedVolunteers = gridApi.getSelectedRows();
    console.log('Selected volunteers:', selectedVolunteers);

    // Enable/disable pre-assign button
    const studyId = $('#studyId').val();
    if (selectedVolunteers.length > 0 && studyId) {
        $('#preAssignBtn').prop('disabled', false);
    } else {
        $('#preAssignBtn').prop('disabled', true);
    }
}

// Pre-assign selected volunteers to study
function preAssignVolunteers() {
    const studyId = parseInt($('#studyId').val());

    if (!studyId) {
        alert('Please select a study before pre-assigning volunteers.');
        return;
    }

    if (selectedVolunteers.length === 0) {
        alert('Please select at least one volunteer to pre-assign.');
        return;
    }

    // Check if any selected volunteers are already assigned
    const alreadyAssigned = selectedVolunteers.filter(v => v.isAssignedToStudy === true);
    if (alreadyAssigned.length > 0) {
        if (!confirm(`${alreadyAssigned.length} volunteer(s) are already assigned to this study. Do you want to continue?`)) {
            return;
        }
    }

    // Extract volunteer IDs
    const volunteerIds = selectedVolunteers.map(v => v.volunteerId);

    // Build pre-assign request
    const preAssignRequest = {
        CompanyId: 1,
        SiteId: 1,
        StudyId: studyId,
        VolunteerIds: volunteerIds,
        UserId: 1
    };

    console.log('Pre-Assign Request:', preAssignRequest);

    // Show loading state
    $('#preAssignBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Pre-Assigning...');

    // Call pre-assign API
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=PreAssign',
        data: JSON.stringify(preAssignRequest),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            console.log('Pre-Assign Response:', response);

            if (response.success) {
                alert(`Success! ${volunteerIds.length} volunteer(s) have been pre-assigned to the study.`);

                // Refresh search results to update assignment status
                performSearch();
            } else {
                alert('Error pre-assigning volunteers: ' + (response.message || 'Unknown error'));
            }

            // Reset button
            $('#preAssignBtn').prop('disabled', false).html('<i class="bi bi-person-plus"></i> Pre-Assign Selected to Study');
        },
        error: function(xhr, status, error) {
            console.error('Pre-Assign Error:', error);
            alert('Error pre-assigning volunteers: ' + (xhr.responseJSON?.message || error));

            // Reset button
            $('#preAssignBtn').prop('disabled', false).html('<i class="bi bi-person-plus"></i> Pre-Assign Selected to Study');
        }
    });
}

// Clear all filters
function clearFilters() {
    $('#filterForm')[0].reset();
    $('#resultsSection').hide();
    selectedVolunteers = [];
}
