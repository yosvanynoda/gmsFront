//global variables
//#region Global Variables

let currentStep = 1;
const totalSteps = 9;

// general data variables 
let monitorsData = [];
let documentsData = [];
let protocolsData = [];
let armsData = [];
let visitsData = [];

//general grid variables
let documentGridApi;
let protocolGridApi;
let armGridApi;
let visitGridApi;
let monitorGridApi;
//#endregion

// JavaScript for Multi-Step Wizard Form
//#region Wizard Form Logic


function changeStep(direction) {
    if (direction === 1) {
        // Validate current step before proceeding
        if (!validateStep(currentStep)) {
            return;
        }
    }

    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');

    // Update step indicator
    const currentIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        currentIndicator.classList.remove('active');
        currentIndicator.classList.add('completed');
        currentIndicator.innerHTML = '<i class="fas fa-check"></i>';

        if (currentStep < totalSteps) {
            const line = document.getElementById(`line${currentStep}`);
            line.classList.add('completed');
        }
    } else {
        currentIndicator.classList.remove('completed');
        currentIndicator.classList.add('active');
        currentIndicator.innerHTML = currentStep;
    }

    currentStep += direction;

    // Show new step
    const newStepElement = document.getElementById(`step${currentStep}`);
    newStepElement.classList.add('active');

    // Update new step indicator
    const newIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        newIndicator.classList.add('active');
    }

    // Update navigation buttons
    updateNavigationButtons();

    // Update review summary on last step
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }
}

function goToStep(step) {
    const elements = document.querySelectorAll(".wizard-step");
    let eStep

    elements.forEach((element) => {
        if (element.id == `step${step}`) {
            element.classList.add('active')
        } else {
            element.classList.remove('active')
        }
    });

    const indicators = document.querySelectorAll(".step-circle");

    indicators.forEach((element) => {
        eStep = parseInt(element.id.replace('step', ''));
        if (eStep < step) {
            const line = document.getElementById(`line${eStep}`);
            if (!validateStep(eStep)) {
                element.classList.add('fail')
                element.classList.remove('completed')
                element.innerHTML = '<i class="fas fa-times"></i>';
                line.classList.add('fail');
                line.classList.remove('completed');
            }
            else {
                element.classList.add('completed')
                element.classList.remove('fail')
                element.innerHTML = '<i class="fas fa-check"></i>';
                line.classList.add('completed');
                line.classList.remove('fail');
            }
        }
        if (element.id == `step${step}-indicator`) {
            element.classList.add('active')
        } else {
            element.classList.remove('active')
        }
    });

    currentStep = step;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';

}

function validateStep(step) {
    //const stepElement = document.getElementById(`step${step}`);
    //const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;

    //requiredFields.forEach(field => {
    //    if (!field.value.trim()) {
    //        field.classList.add('is-invalid');
    //        isValid = false;
    //    } else {
    //        field.classList.remove('is-invalid');
    //    }
    //});

    //if (!isValid) {
    //    alert('Please fill in all required fields before proceeding.');
    //}

    if (step == 3)
        return false;

    return isValid;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
}

function updateReviewSummary() {
    //const summary = document.getElementById('reviewSummary');
    //const studyTitle = document.querySelector('[name="StudyTitle"]').value;
    //const studyPhase = document.querySelector('[name="StudyPhase"]').value;
    //const studyType = document.querySelector('[name="StudyType"]').value;
    //const principalInvestigator = document.querySelector('[name="PrincipalInvestigator"]').value;
    //const targetEnrollment = document.querySelector('[name="TargetEnrollment"]').value;
    //const sponsorName = document.querySelector('[name="SponsorName"]').value;

    //summary.innerHTML = `
    //        <strong>Study Title:</strong> ${studyTitle}<br>
    //        <strong>Phase:</strong> ${studyPhase}<br>
    //        <strong>Type:</strong> ${studyType}<br>
    //        <strong>Principal Investigator:</strong> ${principalInvestigator}<br>
    //        <strong>Target Enrollment:</strong> ${targetEnrollment} participants<br>
    //        <strong>Sponsor:</strong> ${sponsorName}
    //    `;
}


// Initialize navigation buttons
updateNavigationButtons();

//#endregion

// Get URL from hidden field
//#region Starting Page... and fill all combos
$(function () {

    const blinding = JSON.parse($("#blindingType").val());

    setCombos("#blidingList", blinding, 'Blinding Type');

    const phase = JSON.parse($("#phaseType").val());

    setCombos("#phaseList", phase, 'Phase Type');

    const studyDesign = JSON.parse($("#studyDesignType").val());

    setCombos("#studyDesignList", studyDesign, 'Study Design Type');

    const studystatus = JSON.parse($("#studioStatus").val());

    setCombos("#studystatusList", studystatus, 'Study Status');

    const sponsorId = $("#sponsorId").val()

    getSponsor();

    getDisease();

    getCRO();

    getDocumentType();

    //initialize grids
    initializeDocumentGrid();

    initializeProtocolGrid();

    initializeArmGrid();

    initializeVisitGrid();

    initializeMonitorGrid();

});

function getSponsor() {
    $.ajax({
        type: "POST",
        url: urlIndexSponsor + '?handler=SponsorDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#sponsorList", data.data, 'Sponsor');
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getCRO() {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=CRODropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#croList", data.data, 'CRO');
        },
        failure: function (response) {
            $('#failedTitle').html('CRO');
            $('#failedMsg').html('CRO failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('CRO');
            $('#failedMsg').html('CRO failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getDisease() {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=DiseaseDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#diseaseList", data.data, 'Disease');
        },
        failure: function (response) {
            $('#failedTitle').html('Disease');
            $('#failedMsg').html('Disease failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Disease');
            $('#failedMsg').html('Disease failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getMonitorList() {
    const sponsorId = $("#sponsorList").val();
    $.ajax({
        type: "POST",
        url: urlIndexMonitor + '?handler=MonitorDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "sponsorId": sponsorId },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#monitorList", data.data, 'Monitor');
        },
        failure: function (response) {
            $('#failedTitle').html('Monitor');
            $('#failedMsg').html('Monitor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Monitor');
            $('#failedMsg').html('Monitor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getDocumentType() {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=DocTypeDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#documentTypeList", data.data, 'Document Type');
        },
        failure: function (response) {
            $('#failedTitle').html('Document Type');
            $('#failedMsg').html('Document Type failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Document Type');
            $('#failedMsg').html('Document Type failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setCombos(comboName, values, firstElement) {
    //empty combo
    $(comboName).empty();

    //set first element
    $(comboName).append($('<option>', {
        value: -1,
        text: `Select ${firstElement ? firstElement : '...'}`
    }));

    $.each(values, function (index, item) {
        $(comboName).append($('<option>', {
            value: item.id,
            text: item.name
        }));
    });
}
//#endregion

//Save studio
//#region Form Submission

function submitForm() {

    const studioData = {
        STDGeneralData: {
            STDId: 0,
            Code: $('#studyCode').val(),
            SponsorId: parseInt($('#sponsorList').val()),
            Name: $('#studyName').val(), 
            Description: $('textarea#studyDescription').val(),
            Notes: $('textarea#studyNotes').val(),
            DateCreated: $('#studyDateCreated').val(),
            Active: true,
            Goal: parseInt($('#studyGoal').val()),
            Phase: parseInt($('#phaseList').val()),
            Indication: $('#studyIndication').val(), 
            TherapeuticArea: $('#studyTherapeuticArea').val(),
            BlindingType: parseInt($('#blidingList').val()),
            RandomizationType: parseInt($('#studyDesignList').val()),
            StartDate: $('#studyStartDate').val(),
            EndDate: $('#studyEndDate').val(),
            StudioStatus: parseInt($('#studystatusList').val()),
            DiseaseId: parseInt($('#diseaseList').val()),
            CROId: parseInt($('#croList').val())
        },
        STDDocumentation: documentsData,
        STDMonitor: monitorsData,
        STDProtocol: protocolsData,
        STDArms: armsData,
        STDVisits: visitsData
    };

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SaveStudy',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "studioData": studioData },
        success: function (data) {
            // Clear existing options (optional)
            //redirect to index

            window.location.href = "/STD/StudioListData";
        },
        failure: function (response) {
            $('#failedTitle').html('Save Study');
            $('#failedMsg').html('Save Study failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Save Study');
            $('#failedMsg').html('Save Study failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
//#endregion

//Monitor...
//#region Monitor

const myMonitorModal = document.getElementById('monitorModal');

myMonitorModal.addEventListener('show.bs.modal', function (event) {
    // Do something before the modal is shown
    getMonitorList();
});

function initializeMonitorGrid() {
    const gridOptions = {
        rowData: monitorsData,
        columnDefs: [
            { field: "monitorName", headerName: "Monitor", flex: 1 },
            { field: "role", headerName: "Role", flex: 1 },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a data-toggle='tooltip' data-placement='top' title='Delete' class="link-danger" onclick="deleteMonitor(${params.node.rowIndex})">
                            <i class="bi bi-x-octagon-fill"></i> 
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#monitorGrid');
    gridDiv.innerHTML = '';
    monitorGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function addMonitor() {
    let monitor = {
        monitorId: parseInt($('#monitorList').val()),
        monitorName: $('#monitorList option:selected').text(),
        role: $('#monitorRole').val(),
    };

    $('#monitorList').val(-1);
    $('#monitorRole').val('');
    
    monitorsData.push(monitor);

    initializeMonitorGrid();
}

function deleteMonitor(index) {

    monitorsData.splice(index, 1);

    initializeMonitorGrid();
}

//#endregion

//Documentation
//#region Documentation

function initializeDocumentGrid() {
    const gridOptions = {
        rowData: documentsData,
        columnDefs: [
            { field: "docTypeName", headerName: "Type", flex: 2 },
            { field: "docName", headerName: "Name", flex: 2 },
            {
                field: "docDate",
                headerName: "Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            { field: "docVersion", headerName: "Version", flex: 1 },
            //{ field: "docActive", headerName: "Active", flex: 1 },
            //{ field: "notes", headerName: "Notes", flex: 2 },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a data-toggle='tooltip' data-placement='top' title='Delete' class="link-danger" onclick="deleteDocument(${params.node.rowIndex})">
                            <i class="bi bi-x-octagon-fill"></i> 
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#documentGrid');
    gridDiv.innerHTML = '';
    documentGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function addDocument() {
    let document = {
        documentTypeId: parseInt($('#documentTypeList').val()),
        docTypeName: $('#documentTypeList option:selected').text(),
        docName: $('#documentName').val(),
        docDate: $('#docDate').val(),
        docVersion: $('#docVersion').val(),
        docActive: $('#docActive').is(':checked'),
        notes: $('textarea#docNotes').val()
    };

    $('#documentTypeList').val(-1);
    $('#documentName').val('');
    $('#docVersion').val('');
    $('#docDate').val('');
    $("#docActive").prop('checked', false);
    $('textarea#docNotes').val('');

    documentsData.push(document);

    initializeDocumentGrid();
}

function deleteDocument(index) {

    documentsData.splice(index, 1);

    initializeDocumentGrid();
}

//#endregion

//Protocol...
//#region Protocol...

function initializeProtocolGrid() {
    const gridOptions = {
        rowData: protocolsData,
        columnDefs: [
            { field: "name", headerName: "Name", flex: 1 },
            //{
            //    field: "dateCreated",
            //    headerName: "Created",
            //    flex: 1,
            //    valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            //},
            { field: "version", headerName: "Version", flex: 1 },
            {
                field: "startDate",
                headerName: "Start",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            //{
            //    field: "endDate",
            //    headerName: "End",
            //    flex: 1,
            //    valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            //},
            { field: "numVisit", headerName: "Visits", flex: 1 },
            {
                field: "approvedDate",
                headerName: "Approved",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a data-toggle='tooltip' data-placement='top' title='Delete' class="link-danger" onclick="deleteProtocol(${params.node.rowIndex})">
                            <i class="bi bi-x-octagon-fill"></i> 
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#protocolGrid');
    gridDiv.innerHTML = '';
    protocolGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function addProtocol() {
    let protocol = {
        name: $('#protocolName').val(),
        dateCreated: $('#createdDate').val(),
        version: $('#protocolVersion').val(),
        notes: $('textarea#protocolNotes').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        numVisit: parseInt($('#protocolVisit').val()),
        approvedDate: $('#approvedDate').val(),
        
    };

    $('#protocolName').val('');
    $('#createdDate').val('');
    $('#protocolVersion').val('');
    $('textarea#protocolNotes').val('');
    $('#startDate').val('');
    $('#endDate').val('');
    $('#protocolVisit').val('');
    $('#approvedDate').val('');
    

    protocolsData.push(protocol);

    initializeProtocolGrid();
}

function deleteProtocol(index) {

    protocolsData.splice(index, 1);

    initializeProtocolGrid();
}

//#endregion

//Arms...
//#region Arms...

function initializeArmGrid() {
    const gridOptions = {
        rowData: armsData,
        columnDefs: [
            { field: "name", headerName: "Name", flex: 1 },
            { field: "targetEnrollment", headerName: "Target", flex: 1 },
            { field: "doseLevel", headerName: "Dose", flex: 1 },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a data-toggle='tooltip' data-placement='top' title='Delete' class="link-danger" onclick="deleteArm(${params.node.rowIndex})">
                            <i class="bi bi-x-octagon-fill"></i> 
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#armsGrid');
    gridDiv.innerHTML = '';
    armGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function addArm() {
    let arm = {
        name: $('#armName').val(),
        description: $('textarea#armDescription').val(),
        targetEnrollment: parseInt($('#targetEnrollment').val()),
        doseLevel: $('#doseLevel').val(),
    };

    $('#armName').val('');
    $('textarea#armDescription').val('');
    $('#targetEnrollment').val('')
    $('#doseLevel').val('');

    armsData.push(arm);

    initializeArmGrid();
}

function deleteArm(index) {

    armsData.splice(index, 1);

    initializeArmGrid();
}

//#endregion

//Visits...
//#region Visits...
const myVisitModal = document.getElementById('visitModal');

myVisitModal.addEventListener('show.bs.modal', function (event) {
    // Do something before the modal is shown

    let armsCombo = [];

    $.each(armsData, function (index, item) {
        let armD = {
            id: index + 1,
            name: item.name,
        }
        armsCombo.push(armD);
    });


    setCombos('#armList', armsCombo, 'Arm');
});



function initializeVisitGrid() {
    const gridOptions = {
        rowData: visitsData,
        columnDefs: [
            { field: "armName", headerName: "Arm", flex: 1 },
            { field: "name", headerName: "Name", flex: 1 },
            { field: "dayOffSet", headerName: "Off Set", flex: 1 },
            { field: "windowMinus", headerName: "Minus", flex: 1 },
            { field: "windowPlus", headerName: "Plus", flex: 1 },
            { field: "sortOrders", headerName: "Order", flex: 1 },
            { field: "requiredFlag", headerName: "Flag", flex: 1 },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a data-toggle='tooltip' data-placement='top' title='Delete' class="link-danger" onclick="deleteVisit(${params.node.rowIndex})">
                            <i class="bi bi-x-octagon-fill"></i> 
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#visitsGrid');
    gridDiv.innerHTML = '';
    visitGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

function addVisit() {
    let visit = {
        armID: parseInt($('#armList').val()),
        armName: $('#armList option:selected').text(),
        name: $('#visitName').val(),
        dayOffSet: parseInt($('#dayOffSet').val()),
        windowMinus: parseInt($('#windowsMinus').val()),
        windowPlus: parseInt($('#windowsPlus').val()),
        sortOrder: parseInt($('#sortOrder').val()),
        comment: $('textarea#commentVisit').val(),
        requiredFlag: $('#requiredFlag').is(':checked'),

    };

    $('#armList').val(-1);
    $('#visitName').val('');
    $('#dayOffSet').val('');
    $('#windowsMinus').val('');
    $('#windowsPlus').val('');
    $('#sortOrder').val('');
    $('textarea#commentVisit').val('');
    $("#requiredFlag").prop('checked', false);
    
    visitsData.push(visit);

    initializeVisitGrid();
}

function deleteVisit(index) {

    visitsData.splice(index, 1);

    initializeVisitGrid();
}

//#endregion
