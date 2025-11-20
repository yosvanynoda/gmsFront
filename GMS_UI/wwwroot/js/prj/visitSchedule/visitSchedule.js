// Visit Schedule Page JavaScript
let visitScheduleGridApi = null;

$(function () {
    // Set default date to today
    setToday();
    // Load visit schedule for today
    loadVisitSchedule();
});

function setToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    $('#scheduleDate').val(formattedDate);
}

function loadVisitSchedule() {
    const scheduleDateInput = $('#scheduleDate').val();

    if (!scheduleDateInput) {
        alert('Please select a date');
        return;
    }

    const requestData = {
        CompanyId: 1,
        SiteId: 1,
        ScheduleDate: scheduleDateInput
    };

    console.log('Loading visit schedule with:', requestData);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=GetVisitSchedule',
        contentType: "application/json",
        data: JSON.stringify(requestData),
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function(response) {
            console.log('Visit Schedule Response:', response);

            if (response.success && response.data) {
                displayVisitScheduleData(response.data);
                updateSummaryCards(response.data);
            } else {
                console.error('Visit schedule response not successful:', response);
                $('#visitScheduleGrid').html('<div class="alert alert-warning"><i class="bi bi-exclamation-triangle me-2"></i>' + (response.errorMessage || 'No visit schedule data available.') + '</div>');
                updateSummaryCards([]);
            }
        },
        error: function(xhr, status, error) {
            console.error('Visit Schedule Error:', error);
            console.error('XHR Status:', xhr.status);
            console.error('XHR Response:', xhr.responseText);

            $('#visitScheduleGrid').html('<div class="alert alert-danger">Error loading visit schedule data.</div>');
            updateSummaryCards([]);
        }
    });
}

function updateSummaryCards(data) {
    const total = data.length;
    const completed = data.filter(v => (v.visitStatus || v.VisitStatus || v.status || v.Status) === 'Completed').length;
    const pending = total - completed;

    $('#totalVisits').text(total);
    $('#completedVisits').text(completed);
    $('#pendingVisits').text(pending);
}

function displayVisitScheduleData(data) {
    console.log('Displaying visit schedule data:', data);

    // Ensure data is an array
    let visitData = [];

    if (Array.isArray(data)) {
        visitData = data;
    } else if (data && typeof data === 'object') {
        visitData = Object.values(data);
    }

    console.log('Final visitData for grid:', visitData);

    // Setup AG-Grid options
    const gridOptions = {
        rowData: visitData,
        domLayout: 'autoHeight',
        columnDefs: [
            {
                field: "scheduledDate",
                headerName: "Time",
                filter: 'agTextColumnFilter',
                width: 120,
                sort: 'asc',
                valueGetter: params => params.data.scheduledDate || params.data.ScheduledDate,
                valueFormatter: params => {
                    if (!params.value) return '-';
                    const date = new Date(params.value);
                    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }
            },
            {
                field: "subjectName",
                headerName: "Subject",
                filter: 'agTextColumnFilter',
                width: 180,
                valueGetter: params => params.data.subjectName || params.data.SubjectName || ''
            },
            {
                field: "studyName",
                headerName: "Study",
                filter: 'agTextColumnFilter',
                width: 150,
                valueGetter: params => params.data.studyName || params.data.StudyName || ''
            },
            {
                field: "staffName",
                headerName: "Staff",
                filter: 'agTextColumnFilter',
                width: 150,
                valueGetter: params => params.data.staffName || params.data.StaffName || ''
            },
            {
                field: "visitStatus",
                headerName: "Status",
                filter: 'agTextColumnFilter',
                width: 120,
                valueGetter: params => params.data.visitStatus || params.data.VisitStatus || params.data.status || params.data.Status || 'Scheduled',
                cellRenderer: params => {
                    const status = params.value || 'Scheduled';
                    let badgeClass = 'bg-secondary';

                    if (status === 'Completed') badgeClass = 'bg-success';
                    else if (status === 'Scheduled') badgeClass = 'bg-primary';
                    else if (status === 'Missed') badgeClass = 'bg-danger';
                    else if (status === 'Pending') badgeClass = 'bg-warning';

                    return `<span class="badge ${badgeClass}">${status}</span>`;
                }
            },
            {
                colId: "actions",
                headerName: "Actions",
                width: 100,
                cellRenderer: params => {
                    const subjectVisitId = params.data.subjectVisitID || params.data.SubjectVisitID;
                    const subjectId = params.data.subjectID || params.data.SubjectID;
                    const studyId = params.data.studyId || params.data.StudyId;

                    return `<i class="bi bi-check-circle text-success complete-visit-icon"
                               style="cursor: pointer; font-size: 1.2rem;"
                               title="Complete Check-in"
                               data-subject-visit-id="${subjectVisitId}"
                               data-subject-id="${subjectId}"
                               data-study-id="${studyId}"></i>`;
                },
                sortable: false,
                filter: false
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
            console.log('Cell clicked, column:', event.column.getColId());

            if (event.column.getColId() === 'actions') {
                let target = event.event.target;
                console.log('Target element:', target.tagName, target.className);

                // Find the icon element
                if (target.tagName !== 'I') {
                    target = target.closest('i') || target.querySelector('i');
                }

                if (target && target.classList.contains('complete-visit-icon')) {
                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectID || event.data.SubjectID;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const subjectName = event.data.subjectName || event.data.SubjectName;

                    console.log('Complete check-in clicked:', { visitId, subjectId, studyId, subjectName });
                    completeCheckIn(visitId, subjectId, studyId, subjectName);
                }
            }
        }
    };

    const gridDiv = document.querySelector('#visitScheduleGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';

        if (visitData.length === 0) {
            gridDiv.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>No visits scheduled for the selected date.</div>';
        } else {
            visitScheduleGridApi = agGrid.createGrid(gridDiv, gridOptions);
            console.log('Grid created successfully with', visitData.length, 'rows');
        }
    } else {
        console.error('Grid container not found!');
    }
}

function completeCheckIn(visitId, subjectId, studyId, subjectName) {
    if (!confirm(`Complete check-in for ${subjectName}?`)) {
        return;
    }

    const requestData = {
        VisitId: visitId,
        SubjectId: subjectId,
        StudioId: studyId
    };

    console.log('Creating check-in with:', requestData);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=CreateCheckIn',
        contentType: "application/json",
        data: JSON.stringify(requestData),
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function(response) {
            console.log('Check-in response:', response);

            if (response.success) {
                alert('Check-in completed successfully!');
                // Reload the grid to reflect the change
                loadVisitSchedule();
            } else {
                alert('Failed to complete check-in: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Check-in error:', error);
            console.error('XHR Response:', xhr.responseText);
            alert('Error completing check-in. Please try again.');
        }
    });
}
