// Global variables
let currentStep = 1;
let totalSteps = 4;
let subjectData = null;

// AG-Grid API instances
let consentGridApi;
let deviationGridApi;
let adverseGridApi;

// Data arrays
let consentData = [];
let deviationData = [];
let adverseData = [];

// Grid options for Consent
const consentGridOptions = {
    rowData: [],
    columnDefs: [
        { field: "consentID", headerName: "ID", hide: true },
        { field: "protocolVersion", headerName: "Protocol Version", filter: 'agTextColumnFilter', width: 200 },
        {
            field: "consentDate", headerName: "Consent Date", filter: 'agTextColumnFilter', width: 150,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "reconsentFlag", headerName: "Re-consent", width: 120,
            cellRenderer: (params) => {
                return params.value ? '<i class="bi bi-check-circle-fill text-success"></i>' : '';
            }
        },
        {
            field: "signedFlag", headerName: "Signed", width: 120,
            cellRenderer: (params) => {
                if (params.value) {
                    return '<i class="bi bi-check-circle-fill text-success"></i>';
                } else {
                    return '<i class="bi bi-exclamation-triangle-fill text-danger"></i> <span class="text-danger fw-bold">Not Signed</span>';
                }
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            cellRenderer: (params) => {
                return `
                    <a href="#" onclick="editConsent(${params.data.consentID})" class="text-warning" title="Edit">
                        <i class="bi bi-pencil-fill"></i>
                    </a> |
                    <a href="#" onclick="deleteConsent(${params.data.consentID})" class="text-danger" title="Delete">
                        <i class="bi bi-trash-fill"></i>
                    </a>
                `;
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
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [20, 50, 100]
};

// Grid options for Deviation
const deviationGridOptions = {
    rowData: [],
    columnDefs: [
        { field: "pDevID", headerName: "ID", hide: true },
        { field: "deviationName", headerName: "Deviation Type", filter: 'agTextColumnFilter', width: 200 },
        { field: "deviationCode", headerName: "Code", filter: 'agTextColumnFilter', width: 100 },
        { field: "visitID", headerName: "Visit", width: 80 },
        {
            field: "scheduledDate", headerName: "Scheduled Date", width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "reportedDate", headerName: "Reported Date", width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "severity", headerName: "Severity", width: 100,
            cellRenderer: (params) => {
                const severityMap = {1: 'Minor', 2: 'Moderate', 3: 'Major'};
                return severityMap[params.value] || '';
            }
        },
        { field: "outcome", headerName: "Outcome", width: 120 },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            cellRenderer: (params) => {
                return `
                    <a href="#" onclick="editDeviation(${params.data.pDevID})" class="text-warning" title="Edit">
                        <i class="bi bi-pencil-fill"></i>
                    </a> |
                    <a href="#" onclick="deleteDeviation(${params.data.pDevID})" class="text-danger" title="Delete">
                        <i class="bi bi-trash-fill"></i>
                    </a>
                `;
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
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [20, 50, 100]
};

// Grid options for Adverse Events
const adverseGridOptions = {
    rowData: [],
    columnDefs: [
        { field: "aeid", headerName: "ID", hide: true },
        {
            field: "startDate", headerName: "Start Date", width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "endDate", headerName: "End Date", width: 130,
            cellRenderer: (params) => {
                return params.value ? (new Date(params.value)).toLocaleDateString() : '';
            }
        },
        { field: "severity", headerName: "Severity", width: 100 },
        { field: "relationshipToIP", headerName: "Relationship to IP", width: 150 },
        {
            field: "seriousFlag", headerName: "Serious", width: 100,
            cellRenderer: (params) => {
                return params.value ? '<i class="bi bi-exclamation-triangle-fill text-danger"></i>' : '';
            }
        },
        { field: "outcome", headerName: "Outcome", width: 120 },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            cellRenderer: (params) => {
                return `
                    <a href="#" onclick="editAdverse(${params.data.aeid})" class="text-warning" title="Edit">
                        <i class="bi bi-pencil-fill"></i>
                    </a> |
                    <a href="#" onclick="deleteAdverse(${params.data.aeid})" class="text-danger" title="Delete">
                        <i class="bi bi-trash-fill"></i>
                    </a>
                `;
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
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [20, 50, 100]
};

// Document ready
$(function () {
    loadSubjectData();
    initializeGrids();
});

// Load subject data from API
function loadSubjectData() {
    const subjectId = $('#subjectId').val();

    if (!subjectId || subjectId == '0') {
        alert('Invalid Subject ID');
        window.location.href = '/SUB/Subject/Index';
        return;
    }

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=GetSubjectData',
        data: JSON.stringify({
            SubjectId: parseInt(subjectId),
            CompanyId: 1,
            SiteId: 1
        }),
        contentType: "application/json",
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (response) {
            console.log('Subject Data Response:', response);
            console.log('Response Data Type:', typeof response.data);
            console.log('Response Data:', JSON.stringify(response.data, null, 2));

            if (response.success && response.data) {
                subjectData = response.data;
                console.log('subjectData assigned:', subjectData);
                populateFormData();
            } else {
                alert('Error loading subject data: ' + (response.errorMessage || 'Unknown error'));
                window.location.href = '/SUB/Subject/Index';
            }
        },
        error: function (xhr, status, error) {
            console.error('Load Subject Data Error:', error);
            alert('Error loading subject data');
            window.location.href = '/SUB/Subject/Index';
        }
    });
}

// Populate form with loaded data
function populateFormData() {
    if (!subjectData) return;

    console.log('Full subject data:', subjectData);

    const header = subjectData.header || subjectData.Header;

    if (!header) {
        console.error('Header is missing from subject data:', subjectData);
        alert('Error: Subject header data is missing from API response');
        return;
    }

    console.log('Header data:', header);

    // Helper function to safely format date
    function formatDate(dateValue) {
        if (!dateValue) return '';
        try {
            if (typeof dateValue === 'string') {
                return dateValue.split('T')[0];
            }
            // If it's a Date object, convert to ISO string first
            return new Date(dateValue).toISOString().split('T')[0];
        } catch (e) {
            console.error('Error formatting date:', dateValue, e);
            return '';
        }
    }

    // Populate general information (using PascalCase to match C# model)
    $('#subjectIdDisplay').val(header.SubjectId || header.subjectId || '');
    $('#dateCreated').val(formatDate(header.DateCrated || header.dateCrated || header.dateCreated));
    $('#firstName').val(header.FirstName || header.firstName || '');
    $('#lastName').val(header.LastName || header.lastName || '');
    $('#dob').val(formatDate(header.SubjectDOB || header.subjectDOB));
    $('#currentStatus').val(header.CurrentStatus || header.currentStatus || '');
    $('#studyName').val(header.StudyName || header.studyName || '');
    $('#randomCode').val(header.RandomCode || header.randomCode || '');

    const ramdoDate = header.RamdoDate || header.ramdoDate;
    if (ramdoDate && new Date(ramdoDate).getFullYear() > 1900) {
        $('#randomDate').val(formatDate(ramdoDate));
    }

    // Populate grids with safe data handling (using PascalCase to match C# models)
    try {
        consentData = (subjectData.consent || subjectData.Consent || []).map(c => ({
            consentID: c.ConsentID || c.consentID,
            subjectId: c.SubjectId || c.subjectId,
            studyId: c.StudyId || c.studyId,
            protocolVersionId: c.ProtocolVersionId || c.protocolVersionId,
            consentDate: c.ConsentDate || c.consentDate,
            reconsentFlag: c.ReconsentFlag || c.reconsentFlag,
            protocolVersion: c.ProtocolVersion || c.protocolVersion
        }));
    } catch (e) {
        console.error('Error loading consent data:', e);
        consentData = [];
    }

    try {
        deviationData = (subjectData.deviation || subjectData.Deviation || []).map(d => ({
            pDevID: d.PDevID || d.pDevID,
            studyId: d.StudyId || d.studyId,
            subjectID: d.SubjectID || d.subjectID,
            visitID: d.VisitID || d.visitID,
            scheduledDate: d.ScheduledDate || d.scheduledDate,
            description: d.Description || d.description,
            severity: d.Severity || d.severity,
            reportedDate: d.ReportedDate || d.reportedDate,
            outcome: d.Outcome || d.outcome,
            deviationId: d.DeviationId || d.deviationId,
            deviationName: d.DeviationName || d.deviationName,
            deviationCode: d.DeviationCode || d.deviationCode
        }));
    } catch (e) {
        console.error('Error loading deviation data:', e);
        deviationData = [];
    }

    try {
        adverseData = (subjectData.adverse || subjectData.Adverse || []).map(a => ({
            aeid: a.AEID || a.aeid,
            subjectId: a.SubjectId || a.subjectId,
            startDate: a.StartDate || a.startDate,
            endDate: a.EndDate || a.endDate,
            severity: a.Severity || a.severity,
            relationshipToIP: a.RelationshipToIP || a.relationshipToIP,
            seriousFlag: a.SeriousFlag || a.seriousFlag,
            saeCriteria: a.SAECriteria || a.saeCriteria,
            outcome: a.Outcome || a.outcome,
            medDRACode: a.MedDRACode || a.medDRACode
        }));
    } catch (e) {
        console.error('Error loading adverse data:', e);
        adverseData = [];
    }

    updateGrids();
}

// Initialize all grids
function initializeGrids() {
    const consentGridDiv = document.querySelector("#consentGrid");
    consentGridApi = agGrid.createGrid(consentGridDiv, consentGridOptions);

    const deviationGridDiv = document.querySelector("#deviationGrid");
    deviationGridApi = agGrid.createGrid(deviationGridDiv, deviationGridOptions);

    const adverseGridDiv = document.querySelector("#adverseGrid");
    adverseGridApi = agGrid.createGrid(adverseGridDiv, adverseGridOptions);
}

// Update all grids with current data
function updateGrids() {
    if (consentGridApi) {
        consentGridApi.setGridOption('rowData', consentData);
    }
    if (deviationGridApi) {
        deviationGridApi.setGridOption('rowData', deviationData);
    }
    if (adverseGridApi) {
        adverseGridApi.setGridOption('rowData', adverseData);
    }
}

// Wizard navigation functions
function nextStep() {
    if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
    }
}

function previousStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function jumpToStep(step) {
    if (step >= 1 && step <= totalSteps) {
        goToStep(step);
    }
}

function goToStep(step) {
    // Hide current step
    $(`#step${currentStep}`).removeClass('active');
    $(`#step${currentStep}-indicator`).removeClass('active');

    // Show new step
    currentStep = step;
    $(`#step${currentStep}`).addClass('active');
    $(`#step${currentStep}-indicator`).addClass('active');

    // Update button visibility
    updateButtonVisibility();
}

function updateButtonVisibility() {
    // Previous button
    if (currentStep === 1) {
        $('#prevBtn').hide();
    } else {
        $('#prevBtn').show();
    }

    // Next button
    if (currentStep === totalSteps) {
        $('#nextBtn').hide();
        $('#submitBtn').show();
    } else {
        $('#nextBtn').show();
        $('#submitBtn').hide();
    }
}

// Consent functions
function addConsent() {
    $('#consentModalTitle').text('Add Consent');
    $('#consentId').val('0');
    $('#consentProtocolVersion').val('');
    $('#consentDate').val('');
    $('#reconsentFlag').prop('checked', false);
    $('#signedFlag').prop('checked', false);
    $('#consentModal').modal('show');
}

function editConsent(consentId) {
    event.preventDefault();
    const consent = consentData.find(c => c.consentID === consentId);
    if (consent) {
        $('#consentModalTitle').text('Edit Consent');
        $('#consentId').val(consent.consentID);
        $('#consentProtocolVersion').val(consent.protocolVersionId);
        $('#consentDate').val(consent.consentDate ? consent.consentDate.split('T')[0] : '');
        $('#reconsentFlag').prop('checked', consent.reconsentFlag);
        $('#signedFlag').prop('checked', consent.signedFlag);
        $('#consentModal').modal('show');
    }
}

function deleteConsent(consentId) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this consent record?')) {
        consentData = consentData.filter(c => c.consentID !== consentId);
        updateGrids();
    }
}

function saveConsent() {
    const id = parseInt($('#consentId').val());
    const protocolVersionId = parseInt($('#consentProtocolVersion').val());
    const consentDate = $('#consentDate').val();
    const reconsentFlag = $('#reconsentFlag').is(':checked');
    const signedFlag = $('#signedFlag').is(':checked');

    if (!protocolVersionId || !consentDate) {
        alert('Please fill in all required fields');
        return;
    }

    const protocolVersionText = $('#consentProtocolVersion option:selected').text();

    if (id === 0) {
        // Add new consent
        const newId = consentData.length > 0 ? Math.max(...consentData.map(c => c.consentID)) + 1 : 1;
        const header = subjectData.header || subjectData.Header;
        consentData.push({
            consentID: newId,
            subjectId: parseInt($('#subjectId').val()),
            studyId: header.StudyId || header.studyId,
            protocolVersionId: protocolVersionId,
            consentDate: consentDate,
            reconsentFlag: reconsentFlag,
            signedFlag: signedFlag,
            protocolVersion: protocolVersionText
        });
    } else {
        // Update existing consent
        const index = consentData.findIndex(c => c.consentID === id);
        if (index !== -1) {
            consentData[index].protocolVersionId = protocolVersionId;
            consentData[index].consentDate = consentDate;
            consentData[index].reconsentFlag = reconsentFlag;
            consentData[index].signedFlag = signedFlag;
            consentData[index].protocolVersion = protocolVersionText;
        }
    }

    updateGrids();
    $('#consentModal').modal('hide');
}

// Deviation functions
function addDeviation() {
    $('#deviationModalTitle').text('Add Protocol Deviation');
    $('#pDevId').val('0');
    $('#deviationType').val('');
    $('#visitId').val('');
    $('#scheduledDate').val('');
    $('#reportedDate').val('');
    $('#severity').val('1');
    $('#outcome').val('');
    $('#deviationDescription').val('');
    $('#deviationModal').modal('show');
}

function editDeviation(pDevId) {
    event.preventDefault();
    const deviation = deviationData.find(d => d.pDevID === pDevId);
    if (deviation) {
        $('#deviationModalTitle').text('Edit Protocol Deviation');
        $('#pDevId').val(deviation.pDevID);
        $('#deviationType').val(deviation.deviationId);
        $('#visitId').val(deviation.visitID);
        $('#scheduledDate').val(deviation.scheduledDate ? deviation.scheduledDate.split('T')[0] : '');
        $('#reportedDate').val(deviation.reportedDate ? deviation.reportedDate.split('T')[0] : '');
        $('#severity').val(deviation.severity);
        $('#outcome').val(deviation.outcome);
        $('#deviationDescription').val(deviation.description);
        $('#deviationModal').modal('show');
    }
}

function deleteDeviation(pDevId) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this deviation record?')) {
        deviationData = deviationData.filter(d => d.pDevID !== pDevId);
        updateGrids();
    }
}

function saveDeviation() {
    const id = parseInt($('#pDevId').val());
    const deviationId = parseInt($('#deviationType').val());
    const visitId = parseInt($('#visitId').val()) || 0;
    const scheduledDate = $('#scheduledDate').val();
    const reportedDate = $('#reportedDate').val();
    const severity = parseInt($('#severity').val());
    const outcome = $('#outcome').val();
    const description = $('#deviationDescription').val();

    if (!deviationId || !reportedDate || !description) {
        alert('Please fill in all required fields');
        return;
    }

    const deviationText = $('#deviationType option:selected').text();
    const parts = deviationText.split(' - ');
    const deviationName = parts[0];
    const deviationCode = parts[1] || '';

    if (id === 0) {
        // Add new deviation
        const newId = deviationData.length > 0 ? Math.max(...deviationData.map(d => d.pDevID)) + 1 : 1;
        const header = subjectData.header || subjectData.Header;
        deviationData.push({
            pDevID: newId,
            studyId: header.StudyId || header.studyId,
            subjectID: parseInt($('#subjectId').val()),
            visitID: visitId,
            scheduledDate: scheduledDate,
            description: description,
            severity: severity,
            reportedDate: reportedDate,
            outcome: outcome,
            deviationId: deviationId,
            deviationName: deviationName,
            deviationCode: deviationCode
        });
    } else {
        // Update existing deviation
        const index = deviationData.findIndex(d => d.pDevID === id);
        if (index !== -1) {
            deviationData[index].visitID = visitId;
            deviationData[index].scheduledDate = scheduledDate;
            deviationData[index].description = description;
            deviationData[index].severity = severity;
            deviationData[index].reportedDate = reportedDate;
            deviationData[index].outcome = outcome;
            deviationData[index].deviationId = deviationId;
            deviationData[index].deviationName = deviationName;
            deviationData[index].deviationCode = deviationCode;
        }
    }

    updateGrids();
    $('#deviationModal').modal('hide');
}

// Adverse event functions
function addAdverse() {
    // Placeholder for adding adverse events
    alert('Add Adverse Event functionality will be implemented based on API structure');
}

function editAdverse(aeid) {
    event.preventDefault();
    // Placeholder for editing adverse events
    alert('Edit Adverse Event functionality will be implemented based on API structure');
}

function deleteAdverse(aeid) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this adverse event?')) {
        adverseData = adverseData.filter(a => a.aeid !== aeid);
        updateGrids();
    }
}

function saveAdverse() {
    // Placeholder for saving adverse events
    alert('Save Adverse Event functionality will be implemented based on API structure');
}

// Form submission
function submitForm() {
    // TODO: Implement save functionality to update subject data via API
    alert('Save functionality will be implemented to update consent, deviation, and adverse event data');
}

// Cancel and return
function cancelEdit() {
    const returnUrl = $('#returnUrl').val() || '/SUB/Subject/Index';
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        window.location.href = returnUrl;
    }
}
