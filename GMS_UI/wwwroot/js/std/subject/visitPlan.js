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

            if (response.success && response.data) {
                displayVisitPlanData(response.data);
            } else {
                console.error('Visit plan response not successful:', response);
                $('#visitPlanGrid').html('<div class="alert alert-warning">No visit plan data available.</div>');
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

    // Ensure data is an array
    const visitData = Array.isArray(data) ? data : [];

    // Setup AG-Grid options
    const gridOptions = {
        rowData: visitData,
        columnDefs: [
            { field: "visitName", headerName: "Visit Name", filter: 'agTextColumnFilter', flex: 2 },
            { field: "visitNumber", headerName: "Visit #", filter: 'agNumberColumnFilter', width: 100 },
            {
                field: "scheduledDate",
                headerName: "Scheduled Date",
                filter: 'agDateColumnFilter',
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : 'Not Scheduled'
            },
            {
                field: "actualDate",
                headerName: "Actual Date",
                filter: 'agDateColumnFilter',
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : '-'
            },
            {
                field: "status",
                headerName: "Status",
                filter: 'agTextColumnFilter',
                flex: 1,
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
                field: "window",
                headerName: "Visit Window",
                filter: 'agTextColumnFilter',
                flex: 1
            }
        ],
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true,
            flex: 1
        },
        pagination: true,
        paginationPageSize: 20,
        paginationPageSizeSelector: [20, 50, 100]
    };

    const gridDiv = document.querySelector('#visitPlanGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        visitPlanGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

function goBack() {
    const returnUrl = $('#returnUrl').val() || '/SUB/Subject/Index';
    window.location.href = returnUrl;
}
