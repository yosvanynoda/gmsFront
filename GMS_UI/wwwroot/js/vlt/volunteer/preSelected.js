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
            width: 120,
            cellRenderer: (params) => {
                return `<a href="#" class="action-link complete-link" data-volunteer-id="${params.data.volunteerId}" data-study-id="${params.data.studyId}" title="Complete">
                    <i class="bi bi-check-circle text-success"></i>
                </a> |
                <a href="#" class="action-link remove-link" data-volunteer-id="${params.data.volunteerId}" data-study-id="${params.data.studyId}" title="Remove Pre-Assignment">
                    <i class="bi bi-x-circle text-danger"></i>
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

    // Handle complete action link clicks
    $(document).on('click', '.complete-link', function(e) {
        e.preventDefault();
        const volunteerId = $(this).data('volunteer-id');
        const studyId = $(this).data('study-id');
        completePreAssignment(volunteerId, studyId);
    });

    // Handle remove action link clicks
    $(document).on('click', '.remove-link', function(e) {
        e.preventDefault();
        const volunteerId = $(this).data('volunteer-id');
        const studyId = $(this).data('study-id');
        removePreAssignment(volunteerId, studyId);
    });

    // Handle complete selected button click
    $('#btnCompleteSelected').click(function(e) {
        e.preventDefault();
        completeSelectedVolunteers();
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

    // Update button visibility and count
    const count = selectedVolunteers.length;
    $('#selectedCount').text(count);

    if (count > 0) {
        $('#btnCompleteSelected').show();
    } else {
        $('#btnCompleteSelected').hide();
    }
}

function completePreAssignment(volunteerId, studyId) {
    console.log('Complete pre-assignment for volunteer:', volunteerId, 'study:', studyId);

    // Find the volunteer data from the grid
    let volunteerData = null;
    gridApi.forEachNode(node => {
        if (node.data.volunteerId === volunteerId && node.data.studyId === studyId) {
            volunteerData = node.data;
        }
    });

    if (!volunteerData) {
        alert('Could not find volunteer data');
        return;
    }

    // Show modal to collect subject code
    showCreateSubjectModal(volunteerData);
}

function showCreateSubjectModal(volunteerData) {
    console.log('Show create subject modal for volunteer:', volunteerData);

    // Populate modal with volunteer information
    $('#createSubjectVolunteerName').text(volunteerData.volunteerName);
    $('#createSubjectStudyName').text(volunteerData.studyName);

    // Clear the subject code input
    $('#subjectCodeInput').val('');

    // Store IDs in hidden fields
    $('#createSubjectVolunteerId').val(volunteerData.volunteerId);
    $('#createSubjectStudyId').val(volunteerData.studyId);

    // Show the modal
    $('#createSubjectModal').modal('show');

    // Focus on the subject code input
    setTimeout(() => {
        $('#subjectCodeInput').focus();
    }, 500);
}

function confirmCreateSubject() {
    const volunteerId = $('#createSubjectVolunteerId').val();
    const studyId = $('#createSubjectStudyId').val();
    const subjectCode = $('#subjectCodeInput').val().trim();

    console.log('Confirm create subject - VolunteerId:', volunteerId, 'StudyId:', studyId, 'SubjectCode:', subjectCode);

    if (!volunteerId || !studyId) {
        alert('Missing volunteer or study information');
        return;
    }

    if (!subjectCode) {
        alert('Please enter a subject code');
        $('#subjectCodeInput').focus();
        return;
    }

    // Build request
    const createSubjectRequest = {
        VolunteerId: parseInt(volunteerId),
        StudyId: parseInt(studyId),
        SubjectCode: subjectCode
    };

    console.log('Create Subject Request:', createSubjectRequest);

    // Call API
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=CreateSubject',
        data: JSON.stringify(createSubjectRequest),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken
        },
        success: function(response) {
            console.log('Create Subject Response:', response);

            if (response.success) {
                alert(`Success! Subject created with code: ${subjectCode}`);

                // Close the modal
                $('#createSubjectModal').modal('hide');

                // Reload the grid to update the list
                loadPreSelectedVolunteers();
            } else {
                alert('Error creating subject: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Create Subject Error:', error);
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

            alert('Error creating subject: ' + errorMessage);
        }
    });
}

function removePreAssignment(volunteerId, studyId) {
    console.log('Remove pre-assignment for volunteer:', volunteerId, 'study:', studyId);

    // Confirm with user
    if (!confirm(`Are you sure you want to remove the pre-assignment for Volunteer ID ${volunteerId} from this study?`)) {
        return;
    }

    // Build request
    const removePreAssignedRequest = {
        VolunteerId: volunteerId,
        StudyId: studyId,
        CompanyId: 1,
        SiteId: 1
    };

    console.log('Remove Pre-Assignment Request:', removePreAssignedRequest);

    // Call page handler
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=RemovePreAssigned',
        data: JSON.stringify(removePreAssignedRequest),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken
        },
        success: function(response) {
            console.log('Remove Pre-Assignment Response:', response);

            if (response.success) {
                alert(`Success! Pre-assignment removed for Volunteer ID ${volunteerId}.`);

                // Reload the grid to update the list
                loadPreSelectedVolunteers();
            } else {
                alert('Error removing pre-assignment: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Remove Pre-Assignment Error Details:');
            console.error('- Error:', error);
            console.error('- Status:', status);
            console.error('- XHR Status:', xhr.status);
            console.error('- XHR Response:', xhr.responseText);
            console.error('- XHR Response JSON:', xhr.responseJSON);

            let errorMessage = 'Unknown error';

            // Try to extract the most detailed error message
            if (xhr.responseJSON) {
                if (xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                } else if (xhr.responseJSON.errorMessage) {
                    errorMessage = xhr.responseJSON.errorMessage;
                } else if (xhr.responseJSON.title) {
                    errorMessage = xhr.responseJSON.title;
                } else {
                    errorMessage = JSON.stringify(xhr.responseJSON);
                }
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            } else if (error) {
                errorMessage = error;
            } else {
                errorMessage = `HTTP ${xhr.status}: ${status}`;
            }

            alert('Error removing pre-assignment: ' + errorMessage);
        }
    });
}

function completeSelectedVolunteers() {
    if (!selectedVolunteers || selectedVolunteers.length === 0) {
        alert('Please select at least one volunteer.');
        return;
    }

    const count = selectedVolunteers.length;
    if (!confirm(`Are you sure you want to create ${count} subject${count !== 1 ? 's' : ''} from the selected volunteers?\n\nYou will be prompted to enter a subject code for each volunteer.`)) {
        return;
    }

    console.log('Creating subjects for selected volunteers:', selectedVolunteers);

    // Track progress
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    const errors = [];

    // Process each volunteer
    const processNext = (index) => {
        if (index >= selectedVolunteers.length) {
            // All done
            const message = `Completed:\n` +
                `- ${completed} subject${completed !== 1 ? 's' : ''} created successfully\n` +
                (failed > 0 ? `- ${failed} failed\n` : '') +
                (cancelled > 0 ? `- ${cancelled} cancelled` : '');
            alert(message);

            if (errors.length > 0) {
                console.error('Errors during batch creation:', errors);
            }

            // Reload grid
            loadPreSelectedVolunteers();
            return;
        }

        const volunteer = selectedVolunteers[index];

        // Prompt for subject code
        const subjectCode = prompt(`Enter subject code for ${volunteer.volunteerName}:\n(${index + 1} of ${selectedVolunteers.length})`);

        if (subjectCode === null) {
            // User cancelled
            cancelled++;
            processNext(index + 1);
            return;
        }

        if (!subjectCode.trim()) {
            alert('Subject code cannot be empty. Skipping this volunteer.');
            cancelled++;
            processNext(index + 1);
            return;
        }

        const request = {
            VolunteerId: volunteer.volunteerId,
            StudyId: volunteer.studyId,
            SubjectCode: subjectCode.trim()
        };

        $.ajax({
            type: "POST",
            url: window.location.pathname + '?handler=CreateSubject',
            data: JSON.stringify(request),
            contentType: "application/json",
            headers: {
                'RequestVerificationToken': window._csrfToken
            },
            success: function(response) {
                if (response.success) {
                    completed++;
                } else {
                    failed++;
                    errors.push({
                        volunteerId: request.VolunteerId,
                        volunteerName: volunteer.volunteerName,
                        error: response.message || 'Unknown error'
                    });
                }
                // Process next
                processNext(index + 1);
            },
            error: function(xhr, status, error) {
                failed++;
                let errorMessage = 'Unknown error';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                } else if (xhr.responseText) {
                    errorMessage = xhr.responseText;
                } else {
                    errorMessage = error;
                }
                errors.push({
                    volunteerId: request.VolunteerId,
                    volunteerName: volunteer.volunteerName,
                    error: errorMessage
                });
                // Process next
                processNext(index + 1);
            }
        });
    };

    // Start processing
    processNext(0);
}
