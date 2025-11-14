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
        paginationPageSizeSelector: [20, 50, 100]
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
