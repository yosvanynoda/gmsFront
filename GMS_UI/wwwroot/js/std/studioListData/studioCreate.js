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

    if (direction === -1 && currentStep == 1) {
        return; // Prevent going back from the first step
    }

    if (direction === 1 && currentStep == totalSteps) {
        return; // Prevent going forward from the last step
    }

    const isValid = validateStep(currentStep);

    const currentStepElement = document.getElementById(`step${currentStep}-indicator`);
    currentStepElement.classList.remove('active');
    currentStepElement.classList.remove('completed');
    currentStepElement.classList.remove('fail');
    currentStepElement.innerHTML = currentStep;

    if (!isValid) {
        // Mark current step as failed
        currentStepElement.classList.add('fail');
    }
    else {
        // Mark current step not failed
        currentStepElement.classList.add('completed');
        //currentStepElement.innerHTML = '<i class="fas fa-check"></i>';
    }

    // hide current step
    const currentStepScreen = document.getElementById(`step${currentStep}`);
    currentStepScreen.classList.remove('active');
    currentStepScreen.classList.add('completed');

    currentStep += direction;
    const newStepElement = document.getElementById(`step${currentStep}-indicator`);
    newStepElement.classList.add('active');
    newStepElement.classList.remove('completed');
    newStepElement.classList.remove('fail');
    newStepElement.innerHTML = currentStep;

    // Show new step
    const newStepScreen = document.getElementById(`step${currentStep}`);
    newStepScreen.classList.add('active');
    newStepScreen.classList.remove('completed');


    //// Update step indicator
    //const currentIndicator = document.getElementById(`step${currentStep}-indicator`);
    //if (direction === 1) {
    //    currentIndicator.classList.remove('active');
    //    currentIndicator.classList.add('completed');
    //    currentIndicator.innerHTML = '<i class="fas fa-check"></i>';

    //    if (currentStep < totalSteps) {
    //        const line = document.getElementById(`line${currentStep}`);
    //        line.classList.add('completed');
    //    }
    //} else {
    //    currentIndicator.classList.remove('completed');
    //    currentIndicator.classList.remove('active');
    //    currentIndicator.innerHTML = currentStep;
    //}

    //currentStep += direction;

    

    //// Update new step indicator
    //const newIndicator = document.getElementById(`step${currentStep}-indicator`);
    //newIndicator.classList.add('active');
    //newStepElement.classList.remove('completed');
    //newStepElement.classList.remove('fail');


    // Update review summary on last step
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }
}

function goToStep(step) {
    const elements = document.querySelectorAll(".wizard-step");
    let eStep;

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

    //const prevBtn = document.getElementById('prevBtn');
    //const nextBtn = document.getElementById('nextBtn');
    //const submitBtn = document.getElementById('submitBtn');

    //prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    //nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    //if (submitBtn) {
    //    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    //}

    // Update review summary when navigating to step 9
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }

}

function validateStep(step) {
    let isValid = true;

    switch (step) {
        case 1:
            // Validate Step 1 fields
            
            break;
        case 2:
        // Validate Step 2 fields
            break;
        case 3:
            // Validate Step 3 fields
            isValid = false;
            break;
        case 4:
        // Validate Step 4 fields
            break;
        case 5:
        // Validate Step 5 fields
            break;
        case 6:
        // Validate Step 6 fields
            break;
        case 7:
        // Validate Step 7 fields
            break;
        case 8:
        // Validate Step 8 fields
            break;
        default:
            break;
    }

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

    //if (step == 3)
    //    return false;

    return isValid;
}

//function updateNavigationButtons() {
//    const prevBtn = document.getElementById('prevBtn');
//    const nextBtn = document.getElementById('nextBtn');

//    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
//    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';

//    // Note: Submit button is now in the sticky top action bar, not in wizard navigation
//}

function updateReviewSummary() {
    const reviewSummary = document.getElementById('reviewSummary');
    if (!reviewSummary) return;

    // Helper function to get select text
    const getSelectText = (id) => {
        const select = document.getElementById(id);
        return select?.options[select.selectedIndex]?.text || 'Not selected';
    };

    // Helper function to get input value
    const getInputValue = (id) => {
        return document.getElementById(id)?.value || 'Not provided';
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString();
    };

    // Build summary HTML
    let summaryHTML = '';

    // Step 1: Basic Study Information
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fa fa-info-circle"></i> Basic Study Information</h6>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Sponsor:</strong> ${getSelectText('sponsorList')}</p>
                    <p><strong>Site Number:</strong> ${getInputValue('studyCode')}</p>
                    <p><strong>Name:</strong> ${getInputValue('studyName')}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Date Created:</strong> ${formatDate(getInputValue('studyDateCreated'))}</p>
                    <p><strong>Description:</strong> ${getInputValue('studyDescription')}</p>
                    <p><strong>Notes:</strong> ${getInputValue('studyNotes')}</p>
                </div>
            </div>
        </div>
    `;

    // Step 2: Goal and Other Specifications
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fa fa-bullseye"></i> Goal and Specifications</h6>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Goal Enrollment:</strong> ${getInputValue('studyGoal')}</p>
                    <p><strong>Phase:</strong> ${getSelectText('phaseList')}</p>
                    <p><strong>Indication:</strong> ${getInputValue('studyIndication')}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Therapeutic Area:</strong> ${getInputValue('studyTherapeuticArea')}</p>
                    <p><strong>Blinding Type:</strong> ${getSelectText('blidingList')}</p>
                    <p><strong>Study Design Type:</strong> ${getSelectText('studyDesignList')}</p>
                </div>
            </div>
        </div>
    `;

    // Step 3: Dates and Others
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fa fa-calendar"></i> Study Timeline & Status</h6>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Start Date:</strong> ${formatDate(getInputValue('studyStartDate'))}</p>
                    <p><strong>End Date:</strong> ${formatDate(getInputValue('studyEndDate'))}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Study Status:</strong> ${getSelectText('studystatusList')}</p>
                    <p><strong>Disease:</strong> ${getSelectText('diseaseList')}</p>
                    <p><strong>CRO:</strong> ${getSelectText('croList')}</p>
                </div>
            </div>
        </div>
    `;

    // Step 4: Protocols
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fas fa-file-alt"></i> Protocols (${protocolsData.length})</h6>
    `;
    if (protocolsData.length > 0) {
        summaryHTML += '<ul class="list-group">';
        protocolsData.forEach(protocol => {
            summaryHTML += `
                <li class="list-group-item">
                    <strong>${protocol.name}</strong> - Version: ${protocol.version || 'N/A'}
                    ${protocol.startDate ? '| Start: ' + formatDate(protocol.startDate) : ''}
                    ${protocol.numVisit ? '| Visits: ' + protocol.numVisit : ''}
                </li>
            `;
        });
        summaryHTML += '</ul>';
    } else {
        summaryHTML += '<p class="text-muted">No protocols added</p>';
    }
    summaryHTML += '</div>';

    // Step 5: Monitors
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fas fa-user-shield"></i> Monitors (${monitorsData.length})</h6>
    `;
    if (monitorsData.length > 0) {
        summaryHTML += '<ul class="list-group">';
        monitorsData.forEach(monitor => {
            summaryHTML += `
                <li class="list-group-item">
                    <strong>${monitor.firstName} ${monitor.lastName}</strong>
                    ${monitor.email ? '| ' + monitor.email : ''}
                    ${monitor.phone ? '| ' + monitor.phone : ''}
                </li>
            `;
        });
        summaryHTML += '</ul>';
    } else {
        summaryHTML += '<p class="text-muted">No monitors added</p>';
    }
    summaryHTML += '</div>';

    // Step 6: Documents
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fas fa-folder-open"></i> Documents (${documentsData.length})</h6>
    `;
    if (documentsData.length > 0) {
        summaryHTML += '<ul class="list-group">';
        documentsData.forEach(doc => {
            summaryHTML += `
                <li class="list-group-item">
                    <strong>${doc.name}</strong> - ${doc.documentTypeName || 'N/A'}
                    ${doc.version ? '| Version: ' + doc.version : ''}
                    ${doc.documentDate ? '| Date: ' + formatDate(doc.documentDate) : ''}
                </li>
            `;
        });
        summaryHTML += '</ul>';
    } else {
        summaryHTML += '<p class="text-muted">No documents added</p>';
    }
    summaryHTML += '</div>';

    // Step 7: Arms
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fas fa-project-diagram"></i> Arms (${armsData.length})</h6>
    `;
    if (armsData.length > 0) {
        summaryHTML += '<ul class="list-group">';
        armsData.forEach(arm => {
            summaryHTML += `
                <li class="list-group-item">
                    <strong>${arm.name}</strong>
                    ${arm.targetEnrollment ? '| Target: ' + arm.targetEnrollment : ''}
                    ${arm.doseLevel ? '| Dose: ' + arm.doseLevel : ''}
                    ${arm.description ? '<br><small class="text-muted">' + arm.description + '</small>' : ''}
                </li>
            `;
        });
        summaryHTML += '</ul>';
    } else {
        summaryHTML += '<p class="text-muted">No arms added</p>';
    }
    summaryHTML += '</div>';

    // Step 8: Visits
    summaryHTML += `
        <div class="mb-4">
            <h6 class="text-primary border-bottom pb-2"><i class="fas fa-calendar-check"></i> Visits (${visitsData.length})</h6>
    `;
    if (visitsData.length > 0) {
        summaryHTML += '<ul class="list-group">';
        visitsData.forEach(visit => {
            summaryHTML += `
                <li class="list-group-item">
                    <strong>${visit.name}</strong>
                    ${visit.armName ? '| Arm: ' + visit.armName : ''}
                    ${visit.dayOffset !== undefined ? '| Day Offset: ' + visit.dayOffset : ''}
                    ${visit.requiredFlag ? '<span class="badge bg-danger ms-2">Required</span>' : ''}
                </li>
            `;
        });
        summaryHTML += '</ul>';
    } else {
        summaryHTML += '<p class="text-muted">No visits added</p>';
    }
    summaryHTML += '</div>';

    reviewSummary.innerHTML = summaryHTML;
}


// Initialize navigation buttons
//updateNavigationButtons();

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
    const generalData = {
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
    };

    let studioGData = [];

    studioGData.push(generalData);

    const studioData = {
        STDGeneralData: studioGData,
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
    hideNewMonitor();
    getMonitorList();
});

function showNewMonitor() {
    $('#selectExists').hide();
    $('#addNew').show();
    $('#isNewMonitor').val('true');
}


function hideNewMonitor() {
    $('#selectExists').show();
    $('#addNew').hide();
    $('#isNewMonitor').val('false');
}


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
    const isNewM = $('#isNewMonitor').val();


    if (isNewM == 'false') {
       const monitor = {
                monitorId: parseInt($('#monitorList').val()),
                monitorName: $('#monitorList option:selected').text(),
                role: 'Monitor',
        };

        monitorsData.push(monitor);

        // Clear form fields for existing monitor
        $('#monitorList').val(-1);

        // Reinitialize grid
        initializeMonitorGrid();
    }
    else
    {
        const mnId = 0;
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const role = 'Monitor';
        const sponsorId = parseInt($('#sponsorList').val());
        const action = 1;

        $.ajax({
            type: "POST",
            url: urlIndexMonitor + '?handler=CrudMonitor',
            headers: { 'RequestVerificationToken': window._csrfToken },
            data: {
                "id": mnId, "firstName": firstName, "lastName": lastName,
                "email": email, "phone": phone, "role": role, "sponsorId": sponsorId,
                "action": action
},
            success: function (data) {
                const monitor = {
                    monitorId: data.monitorId,
                    monitorName: `${firstName} ${lastName}`,
                    role: role,
                };

                console.log(monitor);

                monitorsData.push(monitor);

                // Clear new monitor form fields
                $('#firstName').val('');
                $('#lastName').val('');
                $('#email').val('');
                $('#phone').val('');

                hideNewMonitor();

                // Reinitialize grid after adding the monitor
                initializeMonitorGrid();
            },
            failure: function (response) {
                $('#failedTitle').html('Save Monitor');
                $('#failedMsg').html('Save Monitor failed. Please try again');
                $('#failedAlert').show();
            },
            error: function (response) {
                $('#failedTitle').html('Save Monitor');
                $('#failedMsg').html('Save Monitor failed. Please try again');
                $('#failedAlert').show();
            }
        });
    }
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
        vId: 0,
        documentTypeId: parseInt($('#documentTypeList').val()) || 0,
        docName: $('#documentName').val(),
        docDate: $('#docDate').val(),
        docVersion: $('#docVersion').val() || '',
        docActive: $('#docActive').is(':checked'),
        notes: $('textarea#docNotes').val() || '',
        companyId: 0,
        userName: 0,
        active: true,
        siteId: 0,
        docPath: ''
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
        notes: $('textarea#protocolNotes').val() || '',
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        numVisit: parseInt($('#protocolVisit').val()) || 0,
        approvedDate: $('#approvedDate').val(),
        companyId: 0,
        userName: 0,
        siteId: 0,
        studyId: 0
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
        armID: 0,
        studyID: 0,
        name: $('#armName').val(),
        description: $('textarea#armDescription').val() || '',
        targetEnrollment: parseInt($('#targetEnrollment').val()) || 0,
        doseLevel: $('#doseLevel').val() || ''
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
            { field: "dayOffset", headerName: "Off Set", flex: 1 },
            { field: "windowMinus", headerName: "Minus", flex: 1 },
            { field: "windowPlus", headerName: "Plus", flex: 1 },
            { field: "sortOrder", headerName: "Order", flex: 1 },
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
        visitID: 0,
        studyID: 0,
        armID: parseInt($('#armList').val()) || 0,
        armName: $('#armList option:selected').text(),
        name: $('#visitName').val(),
        dayOffset: parseInt($('#dayOffSet').val()) || 0,
        windowMinus: parseInt($('#windowsMinus').val()) || 0,
        windowPlus: parseInt($('#windowsPlus').val()) || 0,
        sortOrder: parseInt($('#sortOrder').val()) || 0,
        comment: $('textarea#commentVisit').val() || '',
        requiredFlag: $('#requiredFlag').is(':checked'),
        dependencyOf: 0,
        cost: 0,
        visitType: 0
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

// Cancel from top sticky action bar
function cancelWizardTop() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        window.location.href = '/STD/StudioListData';
    }
}

// Submit form from top sticky action bar - validates all steps first
function submitFormTop() {
    // Validate all steps
    for (let step = 1; step <= totalSteps; step++) {
        if (!validateStep(step)) {
            // Jump to the first step with errors
            goToStep(step);
            // Mark the step indicator as having errors
            const indicator = document.getElementById(`step${step}-indicator`);
            indicator.style.borderColor = 'red';
            indicator.style.color = 'red';
            setTimeout(() => {
                indicator.style.borderColor = '';
                indicator.style.color = '';
            }, 3000);
            alert(`Please complete all required fields in Step ${step} before saving.`);
            return;
        }
    }

    // All steps are valid - proceed to submit
    submitForm();
}
