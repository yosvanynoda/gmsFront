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
                width: 180,
                valueGetter: params => params.data.scheduledDate || params.data.ScheduledDate,
                valueFormatter: params => {
                    if (!params.value) return 'Not Scheduled';
                    const date = new Date(params.value);
                    // Check if it's a valid date and not the default "0001-01-01"
                    if (date.getFullYear() > 1900) {
                        const dateStr = date.toLocaleDateString();
                        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        return `${dateStr} ${timeStr}`;
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
            },
            {
                colId: "actions",
                headerName: "Actions",
                width: 120,
                cellRenderer: params => {
                    const status = params.data.status || params.data.Status || '';
                    const visitId = params.data.visitID || params.data.VisitID;
                    const subjectId = params.data.subjectId || params.data.SubjectId;
                    const studyId = params.data.studyId || params.data.StudyId;
                    const visitName = (params.data.visitName || params.data.VisitName || '');
                    const subjectVisitId = params.data.subjectVisitID || params.data.SubjectVisitID;
                    const staffId = params.data.staffId || params.data.StaffId;
                    const scheduledDate = params.data.scheduledDate || params.data.ScheduledDate;
                    const notes = params.data.notes || params.data.Notes || '';

                    let actions = '';

                    // Show schedule icon for unscheduled visits
                    if (status !== 'Completed' && status !== 'Scheduled') {
                        actions += `<i class="bi bi-calendar-plus text-primary schedule-visit-icon"
                                       style="cursor: pointer; font-size: 1.2rem; margin-right: 8px;"
                                       title="Schedule Visit"
                                       data-visit-id="${visitId}"
                                       data-subject-id="${subjectId}"
                                       data-study-id="${studyId}"
                                       data-visit-name="${visitName}"></i>`;
                    }

                    // Show re-schedule and cancel icons for scheduled visits
                    if (status === 'Scheduled') {
                        actions += `<i class="bi bi-calendar-event text-warning reschedule-visit-icon"
                                       style="cursor: pointer; font-size: 1.2rem; margin-right: 8px;"
                                       title="Re-schedule Visit"
                                       data-visit-id="${visitId}"
                                       data-subject-id="${subjectId}"
                                       data-study-id="${studyId}"
                                       data-visit-name="${visitName}"
                                       data-staff-id="${staffId}"
                                       data-scheduled-date="${scheduledDate}"
                                       data-notes="${notes}"></i>`;
                        actions += `<i class="bi bi-calendar-x text-danger cancel-visit-icon"
                                       style="cursor: pointer; font-size: 1.2rem;"
                                       title="Cancel Visit"
                                       data-subject-visit-id="${subjectVisitId}"
                                       data-visit-name="${visitName}"></i>`;
                    }

                    // Show check icon for completed visits
                    if (status === 'Completed') {
                        actions = `<i class="bi bi-check-circle text-success" style="font-size: 1.2rem;" title="${status}"></i>`;
                    }

                    return actions || '-';
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
            // Check if the Actions column was clicked
            if (event.column.getColId() === 'actions') {
                let target = event.event.target;

                // Find the icon element (could be clicking on the icon or its pseudo-element)
                if (target.tagName !== 'I') {
                    // Check if we clicked inside an icon
                    const iconParent = target.closest('i');
                    if (iconParent) {
                        target = iconParent;
                    } else {
                        // If clicked on span, use the event coordinates to find which icon
                        const icons = event.event.target.querySelectorAll('i');
                        if (icons.length > 0) {
                            // Get the icon closest to the click position
                            const clickX = event.event.offsetX;
                            let clickedIcon = icons[0];
                            icons.forEach(icon => {
                                const rect = icon.getBoundingClientRect();
                                const cellRect = event.event.target.getBoundingClientRect();
                                const iconX = rect.left - cellRect.left;
                                if (clickX >= iconX) {
                                    clickedIcon = icon;
                                }
                            });
                            target = clickedIcon;
                        } else {
                            return;
                        }
                    }
                }

                console.log('Actions icon clicked:', target);
                console.log('Icon classes:', target.className);

                // Check if schedule icon was clicked
                if (target.classList.contains('schedule-visit-icon')) {
                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectId || event.data.SubjectId;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const visitName = event.data.visitName || event.data.VisitName || '';
                    const dayOffset = event.data.dayOffset || event.data.DayOffset || 0;
                    const windowMinus = event.data.windowMinus || event.data.WindowMinus || 0;
                    const windowPlus = event.data.windowPlus || event.data.WindowPlus || 0;

                    console.log('Schedule icon clicked:', { visitId, subjectId, studyId, visitName, dayOffset, windowMinus, windowPlus });
                    openScheduleModal(visitId, subjectId, studyId, visitName, null, null, null, dayOffset, windowMinus, windowPlus);
                }
                // Check if re-schedule icon was clicked
                else if (target.classList.contains('reschedule-visit-icon')) {
                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectId || event.data.SubjectId;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const visitName = event.data.visitName || event.data.VisitName || '';
                    const staffId = event.data.staffId || event.data.StaffId;
                    const scheduledDate = event.data.scheduledDate || event.data.ScheduledDate;
                    const notes = event.data.notes || event.data.Notes || '';
                    const dayOffset = event.data.dayOffset || event.data.DayOffset || 0;
                    const windowMinus = event.data.windowMinus || event.data.WindowMinus || 0;
                    const windowPlus = event.data.windowPlus || event.data.WindowPlus || 0;

                    console.log('Re-schedule icon clicked:', { visitId, subjectId, studyId, visitName, staffId, scheduledDate, notes, dayOffset, windowMinus, windowPlus });
                    openScheduleModal(visitId, subjectId, studyId, visitName, staffId, scheduledDate, notes, dayOffset, windowMinus, windowPlus);
                }
                // Check if cancel icon was clicked
                else if (target.classList.contains('cancel-visit-icon')) {
                    const visitId = event.data.visitID || event.data.VisitID;
                    const subjectId = event.data.subjectId || event.data.SubjectId;
                    const studyId = event.data.studyId || event.data.StudyId;
                    const visitName = event.data.visitName || event.data.VisitName || '';                    
                    const notes = event.data.notes || event.data.Notes || '';

                    
                    cancelVisit(notes, studyId, subjectId, visitId, visitName );
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

// Store calculated date range for validation
let scheduleDateRange = {
    minDate: null,
    maxDate: null,
    idealDate: null,
    hasRange: false
};

function openScheduleModal(visitId, subjectId, studyId, visitName, staffId = null, scheduledDate = null, notes = null, dayOffset = 0, windowMinus = 0, windowPlus = 0) {
    console.log('Opening schedule modal:', { visitId, subjectId, studyId, visitName, staffId, scheduledDate, notes, dayOffset, windowMinus, windowPlus });

    // Set hidden field values
    $('#scheduleVisitId').val(visitId);
    $('#scheduleSubjectId').val(subjectId);
    $('#scheduleStudyId').val(studyId);

    // Update modal title based on whether we're scheduling or re-scheduling
    if (staffId && scheduledDate) {
        $('#scheduleVisitName').text(visitName + ' (Re-schedule)');
    } else {
        $('#scheduleVisitName').text(visitName);
    }

    // Clear form first
    resetScheduleForm();

    // Calculate and display date range based on last completed visit
    calculateAndDisplayDateRange(dayOffset, windowMinus, windowPlus);

    // Load staff dropdown
    loadStaffDropdown(studyId);

    // Pre-fill form if re-scheduling
    if (staffId && scheduledDate) {
        // Wait a bit for staff dropdown to load, then set the value
        setTimeout(() => {
            $('#scheduleStaffId').val(staffId);

            // Format the date for datetime-local input (using local time, not UTC)
            const date = new Date(scheduledDate);
            if (date.getFullYear() > 1900) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                $('#scheduleVisitDate').val(formattedDate);
            }

            if (notes) {
                $('#scheduleNotes').val(notes);
            }
        }, 500);
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleVisitModal'));
    modal.show();
}

function calculateAndDisplayDateRange(dayOffset, windowMinus, windowPlus) {
    // Reset date range
    scheduleDateRange = {
        minDate: null,
        maxDate: null,
        idealDate: null,
        hasRange: false
    };

    // Hide range info by default
    $('#scheduleDateRangeInfo').hide();
    $('#scheduleDateRangeText').text('');

    // Get all visits from the grid to find the last completed one
    if (!visitPlanGridApi) {
        console.log('Grid API not available');
        return;
    }

    const allVisits = [];
    visitPlanGridApi.forEachNode(node => {
        allVisits.push(node.data);
    });

    // Find the last completed visit (by scheduled date)
    const completedVisits = allVisits.filter(visit => {
        const status = visit.status || visit.Status;
        return status === 'Completed';
    });

    console.log('Completed visits:', completedVisits);

    if (completedVisits.length === 0) {
        // No completed visits - allow any date (first visit scenario)
        console.log('No completed visits found - allowing any date');
        return;
    }

    // Sort completed visits by scheduled date descending to get the most recent
    completedVisits.sort((a, b) => {
        const dateA = new Date(a.scheduledDate || a.ScheduledDate);
        const dateB = new Date(b.scheduledDate || b.ScheduledDate);
        return dateB - dateA;
    });

    const lastCompletedVisit = completedVisits[0];
    const lastVisitDate = new Date(lastCompletedVisit.scheduledDate || lastCompletedVisit.ScheduledDate);

    console.log('Last completed visit:', lastCompletedVisit);
    console.log('Last visit date:', lastVisitDate);

    // Calculate ideal date (last visit + day offset)
    const idealDate = new Date(lastVisitDate);
    idealDate.setDate(idealDate.getDate() + dayOffset);

    // Calculate min date (ideal - windowMinus)
    const minDate = new Date(idealDate);
    minDate.setDate(minDate.getDate() - windowMinus);

    // Calculate max date (ideal + windowPlus)
    const maxDate = new Date(idealDate);
    maxDate.setDate(maxDate.getDate() + windowPlus);

    // Store for validation
    scheduleDateRange = {
        minDate: minDate,
        maxDate: maxDate,
        idealDate: idealDate,
        hasRange: true
    };

    console.log('Date range calculated:', scheduleDateRange);

    // Format dates for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Display the range info
    const rangeText = `Ideal date: ${formatDate(idealDate)} | Valid range: ${formatDate(minDate)} to ${formatDate(maxDate)}`;
    $('#scheduleDateRangeText').text(rangeText);
    $('#scheduleDateRangeInfo').show();

    // Set default date to ideal date (at 9:00 AM)
    const year = idealDate.getFullYear();
    const month = String(idealDate.getMonth() + 1).padStart(2, '0');
    const day = String(idealDate.getDate()).padStart(2, '0');
    const defaultDateTime = `${year}-${month}-${day}T09:00`;
    $('#scheduleVisitDate').val(defaultDateTime);
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
    const notes = $('#scheduleNotes').val() || '';

    // Check if date is within the valid range
    if (scheduleDateRange.hasRange && visitDateInput) {
        const selectedDate = new Date(visitDateInput);
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const minDateOnly = new Date(scheduleDateRange.minDate.getFullYear(), scheduleDateRange.minDate.getMonth(), scheduleDateRange.minDate.getDate());
        const maxDateOnly = new Date(scheduleDateRange.maxDate.getFullYear(), scheduleDateRange.maxDate.getMonth(), scheduleDateRange.maxDate.getDate());

        if (selectedDateOnly < minDateOnly || selectedDateOnly > maxDateOnly) {
            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            };

            const warningMessage = `Warning: The selected date (${formatDate(selectedDate)}) is outside the valid range (${formatDate(scheduleDateRange.minDate)} to ${formatDate(scheduleDateRange.maxDate)}).\n\nDo you want to proceed anyway?`;

            if (!confirm(warningMessage)) {
                return;
            }
        }
    }

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

// ==================== Cancel Visit Functions ====================

function cancelVisit(notes, studyId, subjectId, visitId, visitName) {
    //console.log('Cancel visit called:', { subjectVisitId, visitName });

    // Confirm cancellation
    if (!confirm(`Are you sure you want to cancel the visit "${visitName}"?`)) {
        return;
    }

    $.ajax({
        type: "POST",
        url: `${urlVisit}?handler=CancelVisit`,
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {
            "notes": parseInt(notes),
            "studioId": parseInt(studyId),
            "subjectId": parseInt(subjectId),
            "visitId": parseInt(visitId)
        },
        success: function(response) {
            console.log('Cancel visit response:', response);

            if (response.success) {
                alert('Visit cancelled successfully!');
                // Reload grid data
                loadVisitPlanData();
            } else {
                alert('Failed to cancel visit: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Error cancelling visit:', error);
            console.error('XHR Response:', xhr.responseText);
            alert('Error cancelling visit. Please try again.');
        }
    });
}
