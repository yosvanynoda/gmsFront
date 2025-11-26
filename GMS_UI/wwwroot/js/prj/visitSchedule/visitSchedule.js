// Visit Schedule Page JavaScript
let visitScheduleGridApi = null;
let allVisitData = []; // Store all loaded data for frontend filtering
let currentDateFilter = null; // Track current date filter

$(function () {
    // Load initial data: today + 2 weeks
    loadInitialData();

    // Handle team filter change
    $('#teamFilter').on('change', function() {
        applyFilters();
    });
});

function loadInitialData() {
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    const startDate = formatDateForInput(today);
    const endDate = formatDateForInput(twoWeeksLater);

    $('#startDate').val(startDate);
    $('#endDate').val(endDate);

    // Load 2 weeks of data but filter to show only today by default
    loadVisitSchedule(startDate, endDate, true);
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadVisitSchedule(startDate, endDate, filterToday = false) {
    const requestData = {
        CompanyId: 1,
        SiteId: 1,
        StartDate: startDate,
        EndDate: endDate
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

            if (response.success) {
                allVisitData = response.data || [];

                // If initial load, filter to show only today's visits
                if (filterToday) {
                    currentDateFilter = (visit) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const visitDate = new Date(visit.scheduledDate || visit.ScheduledDate);
                        return visitDate >= today && visitDate < tomorrow;
                    };
                    applyFilters();
                } else {
                    currentDateFilter = null;
                    displayVisitScheduleData(allVisitData);
                    updateSummaryCards(allVisitData);
                }
            } else {
                console.error('Visit schedule error:', response);
                $('#visitScheduleGrid').html('<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>' + (response.errorMessage || 'Error loading visit schedule.') + '</div>');
                updateSummaryCards([]);
            }
        },
        error: function(xhr, status, error) {
            console.error('Visit Schedule Error:', error);
            $('#visitScheduleGrid').html('<div class="alert alert-danger">Error loading visit schedule data.</div>');
            updateSummaryCards([]);
        }
    });
}

// Apply both date and team filters
function applyFilters() {
    let filtered = allVisitData;

    // Apply date filter if set
    if (currentDateFilter) {
        filtered = filtered.filter(currentDateFilter);
    }

    // Apply team filter
    const selectedTeam = $('#teamFilter').val();
    if (selectedTeam && selectedTeam !== '') {
        filtered = filtered.filter(visit => {
            const visitTeam = visit.team || visit.Team || '';
            return visitTeam === selectedTeam;
        });
    }

    displayVisitScheduleData(filtered);
    updateSummaryCards(filtered);
}

// Quick filter: Today
function filterToday() {
    currentDateFilter = (visit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const visitDate = new Date(visit.scheduledDate || visit.ScheduledDate);
        return visitDate >= today && visitDate < tomorrow;
    };
    applyFilters();
}

// Quick filter: Tomorrow
function filterTomorrow() {
    currentDateFilter = (visit) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);
        const visitDate = new Date(visit.scheduledDate || visit.ScheduledDate);
        return visitDate >= tomorrow && visitDate < dayAfter;
    };
    applyFilters();
}

// Quick filter: This Week
function filterThisWeek() {
    currentDateFilter = (visit) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        const visitDate = new Date(visit.scheduledDate || visit.ScheduledDate);
        return visitDate >= startOfWeek && visitDate < endOfWeek;
    };
    applyFilters();
}

// Quick filter: Next Week
function filterNextWeek() {
    currentDateFilter = (visit) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfNextWeek = new Date(today);
        startOfNextWeek.setDate(today.getDate() - dayOfWeek + 7);
        startOfNextWeek.setHours(0, 0, 0, 0);
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
        const visitDate = new Date(visit.scheduledDate || visit.ScheduledDate);
        return visitDate >= startOfNextWeek && visitDate < endOfNextWeek;
    };
    applyFilters();
}

// Load custom date range from backend
function loadCustomRange() {
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before or equal to end date');
        return;
    }

    loadVisitSchedule(startDate, endDate);
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
                headerName: "Date & Time",
                filter: 'agDateColumnFilter',
                width: 180,
                sort: 'asc',
                valueGetter: params => params.data.scheduledDate || params.data.ScheduledDate,
                valueFormatter: params => {
                    if (!params.value) return '-';
                    const date = new Date(params.value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
                           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
                field: "team",
                headerName: "Team",
                filter: 'agTextColumnFilter',
                width: 120,
                valueGetter: params => params.data.team || params.data.Team || ''
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
                field: "comment",
                headerName: "Comment",
                filter: 'agTextColumnFilter',
                width: 200,
                valueGetter: params => params.data.comment || params.data.Comment || ''
            },
            {
                colId: "actions",
                headerName: "Actions",
                width: 140,
                cellRenderer: params => {
                    const subjectVisitId = params.data.subjectVisitID || params.data.SubjectVisitID;
                    const subjectId = params.data.subjectID || params.data.SubjectID;
                    const studyId = params.data.studyId || params.data.StudyId;
                    const visitStatus = (params.data.visitStatus || params.data.VisitStatus || params.data.status || params.data.Status || '').toLowerCase();

                    // Determine which actions to disable based on status
                    const isCompleted = visitStatus === 'completed';
                    const isChecking = visitStatus === 'checking';

                    // Check-in icon: disabled if Checking or Completed
                    const checkInDisabled = isChecking || isCompleted;
                    const checkInClass = checkInDisabled ? 'text-secondary' : 'text-info';
                    const checkInCursor = checkInDisabled ? 'not-allowed' : 'pointer';
                    const checkInDisabledClass = checkInDisabled ? 'disabled' : '';
                    const checkInTitle = isCompleted ? 'Visit Completed' : (isChecking ? 'Already Checked In' : 'Check-in');

                    // Complete visit icon: disabled only if Completed
                    const completeDisabled = isCompleted;
                    const completeClass = completeDisabled ? 'text-secondary' : 'text-success';
                    const completeCursor = completeDisabled ? 'not-allowed' : 'pointer';
                    const completeDisabledClass = completeDisabled ? 'disabled' : '';
                    const completeTitle = completeDisabled ? 'Visit Already Completed' : 'Complete Visit';

                    return `<i class="bi bi-box-arrow-in-down ${checkInClass} check-in-icon ${checkInDisabledClass}"
                               style="cursor: ${checkInCursor}; font-size: 1.2rem; margin-right: 8px; opacity: ${checkInDisabled ? '0.5' : '1'};"
                               title="${checkInTitle}"
                               data-subject-visit-id="${subjectVisitId}"
                               data-subject-id="${subjectId}"
                               data-study-id="${studyId}"></i>
                            <i class="bi bi-check-circle-fill ${completeClass} complete-visit-icon ${completeDisabledClass}"
                               style="cursor: ${completeCursor}; font-size: 1.2rem; opacity: ${completeDisabled ? '0.5' : '1'};"
                               title="${completeTitle}"
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
            if (event.column.getColId() === 'actions') {
                let target = event.event.target;
                let iconElement = null;

                // Check if clicked directly on an icon
                if (target.tagName === 'I') {
                    iconElement = target;
                } else {
                    // Get the cell element to search for icons
                    const cellElement = event.eGridCell || target.closest('.ag-cell');

                    if (cellElement) {
                        const checkInIcon = cellElement.querySelector('.check-in-icon');
                        const completeVisitIcon = cellElement.querySelector('.complete-visit-icon');

                        if (checkInIcon && completeVisitIcon) {
                            const checkInRect = checkInIcon.getBoundingClientRect();
                            const completeVisitRect = completeVisitIcon.getBoundingClientRect();
                            const clickX = event.event.clientX;

                            if (clickX >= checkInRect.left && clickX <= checkInRect.right) {
                                iconElement = checkInIcon;
                            } else if (clickX >= completeVisitRect.left && clickX <= completeVisitRect.right) {
                                iconElement = completeVisitIcon;
                            }
                        }
                    }
                }

                if (iconElement) {
                    // Check if the icon is disabled
                    if (iconElement.classList.contains('disabled')) {
                        return;
                    }

                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectID || event.data.SubjectID;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const subjectName = event.data.subjectName || event.data.SubjectName;

                    if (iconElement.classList.contains('check-in-icon')) {
                        completeCheckIn(visitId, subjectId, studyId, subjectName);
                    } else if (iconElement.classList.contains('complete-visit-icon')) {
                        completeVisit(visitId, subjectId, studyId, subjectName);
                    }
                }
            }
        }
    };

    const gridDiv = document.querySelector('#visitScheduleGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';

        if (visitData.length === 0) {
            gridDiv.innerHTML =
                '<div class="alert alert-info">' +
                '<i class="bi bi-calendar-x me-2"></i>' +
                '<strong>No visits scheduled</strong><br>' +
                'There are no visits scheduled for the selected date range.' +
                '</div>';
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
                // Reload the data
                const startDate = $('#startDate').val();
                const endDate = $('#endDate').val();
                loadVisitSchedule(startDate, endDate);
            } else {
                alert('Failed to complete check-in: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Check-in error:', error);
            alert('Error completing check-in. Please try again.');
        }
    });
}

function completeVisit(visitId, subjectId, studyId, subjectName) {
    if (!confirm(`Complete visit for ${subjectName}?`)) {
        return;
    }

    const requestData = {
        VisitId: visitId,
        SubjectId: subjectId,
        StudioId: studyId
    };

    console.log('Completing visit with:', requestData);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=CompleteVisit',
        contentType: "application/json",
        data: JSON.stringify(requestData),
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function(response) {
            console.log('Complete visit response:', response);

            if (response.success) {
                alert('Visit completed successfully!');
                // Reload the data
                const startDate = $('#startDate').val();
                const endDate = $('#endDate').val();
                loadVisitSchedule(startDate, endDate);
            } else {
                alert('Failed to complete visit: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Complete visit error:', error);
            alert('Error completing visit. Please try again.');
        }
    });
}
