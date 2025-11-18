// Visit Plan Page JavaScript
let visitPlanGridApi = null;

$(function () {
    loadVisitPlanData();
});

function loadVisitPlanData() {
    const subjectId = $('#subjectId').val();
    const studyId = $('#studyId').val();

    if (!subjectId || subjectId == '0' || !studyId || studyId == '0') {
        alert('Invalid Subject ID or Study ID');
        goBack();
        return;
    }

    const requestData = {
        CompanyId: 1,
        SiteId: 1,
        SubjectId: parseInt(subjectId),
        StudyId: parseInt(studyId)
    };

    console.log('Loading visit plan data with:', requestData);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=GetVisitPlanData',
        contentType: "application/json",
        data: JSON.stringify(requestData),
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function(response) {
            console.log('Visit Plan Response:', response);
            console.log('Response success:', response.success);
            console.log('Response data:', response.data);
            console.log('Response data type:', typeof response.data);

            if (response.data) {
                console.log('Data stringified:', JSON.stringify(response.data, null, 2));
            }

            if (response.success && response.data) {
                displayVisitPlanData(response.data);
            } else {
                console.error('Visit plan response not successful:', response);
                console.error('Error message:', response.errorMessage);
                $('#visitPlanGrid').html('<div class="alert alert-warning"><i class="bi bi-exclamation-triangle me-2"></i>' + (response.errorMessage || 'No visit plan data available.') + '</div>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Visit Plan Error:', error);
            console.error('XHR Status:', xhr.status);
            console.error('XHR Response:', xhr.responseText);

            $('#visitPlanGrid').html('<div class="alert alert-danger">Error loading visit plan data.</div>');
        }
    });
}

function displayVisitPlanData(data) {
    console.log('Displaying visit plan data:', data);
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Data stringified:', JSON.stringify(data, null, 2));

    // Ensure data is an array
    let visitData = [];

    if (Array.isArray(data)) {
        visitData = data;
    } else if (data && typeof data === 'object') {
        // If data is an object, try to extract array from it
        visitData = Object.values(data);
    }

    console.log('Final visitData for grid:', visitData);
    console.log('Visit data count:', visitData.length);

    if (visitData.length > 0) {
        console.log('First item:', JSON.stringify(visitData[0], null, 2));
    }

    // Setup AG-Grid options
    const gridOptions = {
        rowData: visitData,
        domLayout: 'autoHeight',
        columnDefs: [
            {
                colId: "actions",
                headerName: "Actions",
                width: 80,
                cellRenderer: params => {
                    const status = params.data.status || params.data.Status || '';
                    const isSchedulable = status !== 'Completed' && status !== 'Scheduled';

                    if (isSchedulable) {
                        const visitId = params.data.visitID || params.data.VisitID;
                        const subjectId = params.data.subjectId || params.data.SubjectId;
                        const studyId = params.data.studyId || params.data.StudyId;
                        const visitName = (params.data.visitName || params.data.VisitName || '');

                        return `<i class="bi bi-calendar-plus text-primary schedule-visit-icon"
                                   style="cursor: pointer; font-size: 1.2rem;"
                                   title="Schedule Visit"
                                   data-visit-id="${visitId}"
                                   data-subject-id="${subjectId}"
                                   data-study-id="${studyId}"
                                   data-visit-name="${visitName}"></i>`;
                    } else {
                        return `<i class="bi bi-check-circle text-success" style="font-size: 1.2rem;" title="${status}"></i>`;
                    }
                },
                sortable: false,
                filter: false
            },
            {
                field: "visitName",
                headerName: "Visit Name",
                filter: 'agTextColumnFilter',
                width: 150,
                valueGetter: params => params.data.visitName || params.data.VisitName || ''
            },
            {
                field: "dayOffset",
                headerName: "Day Offset",
                filter: 'agNumberColumnFilter',
                width: 120,
                valueGetter: params => params.data.dayOffset || params.data.DayOffset || ''
            },
            {
                field: "scheduledDate",
                headerName: "Scheduled Date",
                filter: 'agDateColumnFilter',
                width: 150,
                valueGetter: params => params.data.scheduledDate || params.data.ScheduledDate,
                valueFormatter: params => {
                    if (!params.value) return 'Not Scheduled';
                    const date = new Date(params.value);
                    // Check if it's a valid date and not the default "0001-01-01"
                    if (date.getFullYear() > 1900) {
                        return date.toLocaleDateString();
                    }
                    return 'Not Scheduled';
                }
            },
            {
                field: "status",
                headerName: "Status",
                filter: 'agTextColumnFilter',
                width: 120,
                valueGetter: params => params.data.status || params.data.Status,
                cellRenderer: params => {
                    const status = params.value || 'Pending';
                    let badgeClass = 'bg-secondary';

                    if (status === 'Completed') badgeClass = 'bg-success';
                    else if (status === 'Scheduled') badgeClass = 'bg-primary';
                    else if (status === 'Missed') badgeClass = 'bg-danger';
                    else if (status === 'Pending') badgeClass = 'bg-warning';

                    return `<span class="badge ${badgeClass}">${status}</span>`;
                }
            },
            {
                field: "staffName",
                headerName: "Staff Name",
                filter: 'agTextColumnFilter',
                width: 150,
                valueGetter: params => params.data.staffName || params.data.StaffName,
                valueFormatter: params => params.value || '-'
            },
            {
                field: "windowMinus",
                headerName: "Window -",
                filter: 'agNumberColumnFilter',
                width: 100,
                valueGetter: params => params.data.windowMinus || params.data.WindowMinus,
                valueFormatter: params => params.value ? `${params.value} days` : '-'
            },
            {
                field: "windowPlus",
                headerName: "Window +",
                filter: 'agNumberColumnFilter',
                width: 100,
                valueGetter: params => params.data.windowPlus || params.data.WindowPlus,
                valueFormatter: params => params.value ? `${params.value} days` : '-'
            },
            {
                field: "requiredFlag",
                headerName: "Required",
                width: 100,
                valueGetter: params => params.data.requiredFlag || params.data.RequiredFlag,
                cellRenderer: params => {
                    return params.value ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-dash-circle text-secondary"></i>';
                }
            },
            {
                field: "notes",
                headerName: "Notes",
                filter: 'agTextColumnFilter',
                flex: 1,
                valueGetter: params => params.data.notes || params.data.Notes,
                valueFormatter: params => params.value || '-'
            }
        ],
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true
        },
        pagination: true,
        paginationPageSize: 20,
        paginationPageSizeSelector: [20, 50, 100],
        onCellClicked: (event) => {
            // Check if the Actions column was clicked
            if (event.column.getColId() === 'actions') {
                const status = event.data.status || event.data.Status || '';
                const isSchedulable = status !== 'Completed' && status !== 'Scheduled';

                if (isSchedulable) {
                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectId || event.data.SubjectId;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const visitName = event.data.visitName || event.data.VisitName || '';

                    console.log('Action cell clicked:', { visitId, subjectId, studyId, visitName });
                    openScheduleModal(visitId, subjectId, studyId, visitName);
                }
            }
        }
    };

    const gridDiv = document.querySelector('#visitPlanGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';

        if (visitData.length === 0) {
            gridDiv.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>No visit plan data available for this subject.</div>';
        } else {
            visitPlanGridApi = agGrid.createGrid(gridDiv, gridOptions);
            console.log('Grid created successfully with', visitData.length, 'rows');
        }
    } else {
        console.error('Grid container not found!');
    }
}

function goBack() {
    const returnUrl = $('#returnUrl').val() || '/SUB/Subject/Index';
    window.location.href = returnUrl;
}

// ==================== Schedule Visit Modal Functions ====================

function openScheduleModal(visitId, subjectId, studyId, visitName) {
    console.log('Opening schedule modal:', { visitId, subjectId, studyId, visitName });

    // Set hidden field values
    $('#scheduleVisitId').val(visitId);
    $('#scheduleSubjectId').val(subjectId);
    $('#scheduleStudyId').val(studyId);
    $('#scheduleVisitName').text(visitName);

    // Clear form
    resetScheduleForm();

    // Load staff dropdown
    loadStaffDropdown(studyId);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleVisitModal'));
    modal.show();
}

function loadStaffDropdown(studyId) {
    console.log('Loading staff for study:', studyId);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=GetStaffList',
        contentType: "application/json",
        data: JSON.stringify({
            CompanyId: 1,
            SiteId: 1,
            StudioId: parseInt(studyId)
        }),
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function(response) {
            console.log('Staff dropdown response:', response);
            console.log('Staff data:', response.data);

            const select = $('#scheduleStaffId');
            select.empty();
            select.append('<option value="">Select Staff</option>');

            if (response.success && response.data && response.data.length > 0) {
                $.each(response.data, function(index, staff) {
                    console.log('Staff item:', staff);
                    console.log('Staff item keys:', Object.keys(staff));
                    console.log('Staff item JSON:', JSON.stringify(staff, null, 2));

                    // Handle both camelCase and PascalCase property names
                    const firstName = staff.firstName || staff.FirstName || '';
                    const lastName = staff.lastName || staff.LastName || '';
                    const staffId = staff.staffId || staff.StaffId;

                    console.log('Extracted values:', {
                        firstName,
                        lastName,
                        staffId,
                        'staff.firstName': staff.firstName,
                        'staff.FirstName': staff.FirstName,
                        'staff.lastName': staff.lastName,
                        'staff.LastName': staff.LastName
                    });

                    // Build staff name
                    let staffName = `${firstName} ${lastName}`.trim();

                    // If no name from first/last, try other properties
                    if (!staffName) {
                        staffName = staff.name || staff.Name || `Staff ${staffId}` || 'Unknown';
                    }

                    console.log('Final staff name:', staffName);

                    select.append($('<option>', {
                        value: staffId,
                        text: staffName
                    }));
                });
                console.log('Total staff options added:', response.data.length);
            } else {
                console.log('No staff data available');
                select.append('<option value="">No staff available</option>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading staff dropdown:', error);
            console.error('XHR Response:', xhr.responseText);
            alert('Failed to load staff list. Please try again.');
        }
    });
}

function validateScheduleForm() {
    // Clear previous validation messages
    $('#validateStaff').text('');
    $('#validateVisitDate').text('');

    const staffId = $('#scheduleStaffId').val();
    const visitDate = $('#scheduleVisitDate').val();

    let isValid = true;

    if (!staffId) {
        $('#validateStaff').text('Please select a staff member');
        isValid = false;
    }

    if (!visitDate) {
        $('#validateVisitDate').text('Please select a visit date and time');
        isValid = false;
    }

    return isValid;
}

function scheduleVisit() {
    console.log('Schedule visit button clicked');

    if (!validateScheduleForm()) {
        return;
    }

    const visitId = $('#scheduleVisitId').val();
    const subjectId = $('#scheduleSubjectId').val();
    const studyId = $('#scheduleStudyId').val();
    const staffId = $('#scheduleStaffId').val();
    const visitDateInput = $('#scheduleVisitDate').val();
    const notes = $('#scheduleNotes').val();

    
    //const requestData = {
    //    VisitId: parseInt(visitId),
    //    SubjectId: parseInt(subjectId),
    //    StudioId: parseInt(studyId), // Map StudyId to StudioId
    //    Staffid: parseInt(staffId),
    //    VisitDate: visitDateInput,
    //    Notes: notes || ''
    //};
      

    $.ajax({
        type: "POST",
        url: `${urlVisit}?handler=CreateVisit`,
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {
            "staffId": parseInt(staffId), "notes": notes, "studioId": parseInt(studyId),
            "subjectId": parseInt(subjectId), "visitDate": visitDateInput, 
            "visitId": parseInt(visitId) 
        },
        success: function(response) {
            console.log('Schedule visit response:', response);

            if (response.success) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleVisitModal'));
                modal.hide();

                // Show success message
                alert('Visit scheduled successfully!');

                // Reload grid data
                loadVisitPlanData();
            } else {
                alert('Failed to schedule visit: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Error scheduling visit:', error);
            console.error('XHR Response:', xhr.responseText);
            alert('Error scheduling visit. Please try again.');
        }
    });
}

function resetScheduleForm() {
    $('#scheduleStaffId').val('');
    $('#scheduleVisitDate').val('');
    $('#scheduleNotes').val('');
    $('#validateStaff').text('');
    $('#validateVisitDate').text('');
}
