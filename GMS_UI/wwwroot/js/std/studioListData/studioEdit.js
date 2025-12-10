//global variables
//#region Global Variables

let currentStep = 1;
const totalSteps = 9;

// Studio ID for edit mode
let studioId = 0;

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
    let isValid = true;
    return isValid;
}

function updateNavigationButtons() {
    if (currentStep === 1) {
        $('#prevBtn').hide();
    } else {
        $('#prevBtn').show();
    }

    if (currentStep === totalSteps) {
        $('#nextBtn').hide();
        $('#submitBtn').show();
    } else {
        $('#nextBtn').show();
        $('#submitBtn').hide();
    }
}

function updateReviewSummary() {
    // Implement review summary if needed
}


// Initialize navigation buttons
updateNavigationButtons();

//#endregion

// Get studio ID from URL and load data
//#region Get URL Parameters and Load Data

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function loadStudioData() {
    studioId = parseInt(getUrlParameter('id'));
    console.log('Loading studio data for ID:', studioId);

    if (!studioId || studioId === 0) {
        alert('Invalid studio ID');
        window.location.href = "/STD/StudioListData";
        return;
    }

    $.ajax({
        type: "GET",
        url: urlIndex + '?handler=GetStudioData&studioId=' + studioId,
        success: function (response) {
            console.log('API Response:', response);
            if (response.success && response.data) {
                console.log('Populating form with data:', response.data);
                // Store data globally for AJAX dropdown callbacks
                window.loadedStudioData = response.data;
                populateFormWithData(response.data);
            } else {
                console.error('Failed to load studio data:', response);
                alert('Failed to load studio data: ' + (response.message || 'Unknown error'));
            }
        },
        failure: function (response) {
            console.error('AJAX failure:', response);
            alert('Failed to load studio data');
        },
        error: function (response) {
            console.error('AJAX error:', response);
            alert('Error loading studio data: ' + (response.responseText || 'Unknown error'));
        }
    });
}

function populateFormWithData(data) {
    console.log('populateFormWithData called with:', data);

    // Populate general data (Step 1)
    if (data.header) {
        console.log('Populating header data:', data.header);
        console.log('All header properties:', Object.keys(data.header));

        const general = data.header;
        // API returns 'code' and 'name' for reading
        $('#studyCode').val(general.code || '');
        $('#studyName').val(general.name || '');
        $('textarea#studyDescription').val(general.description || '');
        $('textarea#studyNotes').val(general.notes || '');
        $('#studyDateCreated').val(formatDateForInput(general.dateCreated));
        // Populate Step 2 fields
        $('#studyGoal').val(general.goal || '');
        $('#studyIndication').val(general.indication || '');
        $('#studyTherapeuticArea').val(general.therapeuticArea || '');

        console.log('Step 2 fields populated:', {
            goal: general.goal,
            indication: general.indication,
            therapeuticArea: general.therapeuticArea,
            goalFieldValue: $('#studyGoal').val(),
            indicationFieldValue: $('#studyIndication').val(),
            therapeuticAreaFieldValue: $('#studyTherapeuticArea').val()
        });

        // Populate Step 3 (Dates) fields
        $('#studyStartDate').val(formatDateForInput(general.startDate));
        $('#studyEndDate').val(formatDateForInput(general.endDate));

        // Set dropdown values after they're loaded
        setTimeout(() => {
            console.log('Setting dropdown values:', {
                sponsor: general.sponsorId,
                phase: general.phase,
                blindType: general.blindType,
                randomization: general.randomizationType,
                status: general.studioStatus,
                disease: general.diseaseId,
                cro: general.croId
            });

            // Check if dropdowns have options
            console.log('Phase dropdown options count:', $('#phaseList option').length);
            console.log('Study Design dropdown options count:', $('#studyDesignList option').length);
            console.log('Blinding Type dropdown options count:', $('#blidingList option').length);

            // Log all option values
            console.log('Phase options:', $('#phaseList option').map(function() { return this.value; }).get());
            console.log('Study Design options:', $('#studyDesignList option').map(function() { return this.value; }).get());
            console.log('Blinding Type options:', $('#blidingList option').map(function() { return this.value; }).get());
            console.log('Trying to set Phase to:', general.phase);
            console.log('Trying to set Study Design to:', general.randomizationType);
            console.log('Trying to set Blinding Type to:', general.blindType);

            // Set TempData dropdowns (populated on page load)
            $('#phaseList').val(String(general.phase ?? -1));
            $('#blidingList').val(String(general.blindType ?? -1));
            $('#studyDesignList').val(String(general.randomizationType ?? -1));
            $('#studystatusList').val(String(general.studioStatus ?? -1));

            // AJAX dropdowns (sponsor, disease, cro) are set in their own callbacks
            // after they finish loading

            // Log what was actually selected
            console.log('Phase selected value:', $('#phaseList').val());
            console.log('Study Design selected value:', $('#studyDesignList').val());
            console.log('Blinding Type selected value:', $('#blidingList').val());
        }, 1000);
    }

    // Populate monitors data
    if (data.monitors && data.monitors.length > 0) {
        console.log('Populating monitors:', data.monitors);
        console.log('First monitor structure:', data.monitors[0]);
        console.log('First monitor keys:', Object.keys(data.monitors[0]));
        monitorsData = data.monitors;
        initializeMonitorGrid();
    }

    // Populate documents data
    if (data.documentation && data.documentation.length > 0) {
        documentsData = data.documentation.map(doc => ({
            vId: doc.vId || 0,
            documentTypeId: doc.documentTypeId || 0,
            docTypeName: doc.docTypeName || '',
            docName: doc.docName || '',
            docDate: doc.docDate || '',
            docVersion: doc.docVersion || '',
            docActive: doc.docActive || false,
            notes: doc.notes || '',
            companyId: doc.companyId || 0,
            userName: doc.userName || 0,
            active: doc.active || true,
            siteId: doc.siteId || 0,
            docPath: doc.docPath || ''
        }));
        initializeDocumentGrid();
    }

    // Populate protocols data
    if (data.protocol && data.protocol.length > 0) {
        protocolsData = data.protocol.map(protocol => ({
            protocol: protocol.protocol || '',
            dateCreated: protocol.dateCreated || null,
            version: protocol.version || '',
            notes: protocol.notes || '',
            startDate: protocol.startDate || null,
            endDate: protocol.endDate || null,
            numVisit: protocol.numVisit || 0,
            approvedDate: protocol.approvedDate || null,
            companyId: protocol.companyId || 0,
            userName: protocol.userName || 0,
            siteId: protocol.siteId || 0,
            studyId: protocol.studyId || 0
        }));
        initializeProtocolGrid();
    }

    // Populate arms data
    if (data.arms && data.arms.length > 0) {
        armsData = data.arms.map(arm => ({
            armID: arm.armID || 0,
            studyID: arm.studyID || 0,
            name: arm.name || '',
            description: arm.description || '',
            targetEnrollment: arm.targetEnrollment || 0,
            doseLevel: arm.doseLevel || ''
        }));
        initializeArmGrid();
    }

    // Populate visits data
    if (data.visitDefinition && data.visitDefinition.length > 0) {
        visitsData = data.visitDefinition.map(visit => ({
            visitID: visit.visitID || 0,
            studyID: visit.studyID || 0,
            armID: visit.armID || 0,
            armName: visit.armName || '',
            name: visit.name || '',
            dayOffset: visit.dayOffset || 0,
            windowMinus: visit.windowMinus || 0,
            windowPlus: visit.windowPlus || 0,
            sortOrder: visit.sortOrder || 0,
            comment: visit.comment || '',
            requiredFlag: visit.requiredFlag || false,
            dependencyOf: visit.dependencyOf || 0,
            cost: visit.cost || 0,
            visitType: visit.visitType || 0
        }));
        initializeVisitGrid();
    }
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
}

//#endregion

// Starting Page... and fill all combos
//#region Starting Page... and fill all combos
$(function () {

    const blinding = JSON.parse($("#blindingType").val());
    console.log('Blinding data:', blinding);
    setCombos("#blidingList", blinding, 'Blinding Type');

    const phase = JSON.parse($("#phaseType").val());
    console.log('Phase data:', phase);
    console.log('First phase item:', phase[0]);
    setCombos("#phaseList", phase, 'Phase Type');

    const studyDesign = JSON.parse($("#studyDesignType").val());
    setCombos("#studyDesignList", studyDesign, 'Study Design Type');

    const studystatus = JSON.parse($("#studioStatus").val());
    setCombos("#studystatusList", studystatus, 'Study Status');

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

    // Load existing studio data
    loadStudioData();
});

function getSponsor() {
    $.ajax({
        type: "POST",
        url: urlIndexSponsor + '?handler=SponsorDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setCombos("#sponsorList", data.data, 'Sponsor');
            // Set the selected value after dropdown is populated
            // Retry if data not loaded yet
            let retryCount = 0;
            const setSelectedValue = () => {
                if (window.loadedStudioData && window.loadedStudioData.header) {
                    $('#sponsorList').val(String(window.loadedStudioData.header.sponsorId ?? -1));
                    console.log('Sponsor dropdown set to:', window.loadedStudioData.header.sponsorId);
                    console.log('Sponsor selected value:', $('#sponsorList').val());
                } else if (retryCount < 10) {
                    retryCount++;
                    setTimeout(setSelectedValue, 200);
                }
            };
            setSelectedValue();
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
            setCombos("#croList", data.data, 'CRO');
            // Set the selected value after dropdown is populated
            // Retry if data not loaded yet
            let retryCount = 0;
            const setSelectedValue = () => {
                if (window.loadedStudioData && window.loadedStudioData.header) {
                    $('#croList').val(String(window.loadedStudioData.header.croId ?? -1));
                    console.log('CRO dropdown set to:', window.loadedStudioData.header.croId);
                    console.log('CRO selected value:', $('#croList').val());
                } else if (retryCount < 10) {
                    retryCount++;
                    setTimeout(setSelectedValue, 200);
                }
            };
            setSelectedValue();
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
            setCombos("#diseaseList", data.data, 'Disease');
            // Set the selected value after dropdown is populated
            // Retry if data not loaded yet
            let retryCount = 0;
            const setSelectedValue = () => {
                if (window.loadedStudioData && window.loadedStudioData.header) {
                    $('#diseaseList').val(String(window.loadedStudioData.header.diseaseId ?? -1));
                    console.log('Disease dropdown set to:', window.loadedStudioData.header.diseaseId);
                    console.log('Disease selected value:', $('#diseaseList').val());
                } else if (retryCount < 10) {
                    retryCount++;
                    setTimeout(setSelectedValue, 200);
                }
            };
            setSelectedValue();
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
        // Handle both PascalCase (Id, Name) from TempData and camelCase (id, name) from AJAX
        const itemId = item.Id ?? item.id;
        const itemName = item.Name ?? item.name;

        $(comboName).append($('<option>', {
            value: itemId,
            text: itemName
        }));
    });
}
//#endregion

//Update studio (changed from Save)
//#region Form Submission

function submitForm() {
    const generalData = {
        STDId: studioId,  // Use the loaded studio ID for update
        Code: $('#studyCode').val(),
        SponsorId: parseInt($('#sponsorList').val()),
        Name: $('#studyName').val(),
        Description: $('textarea#studyDescription').val(),
        Notes: $('textarea#studyNotes').val(),
        DateCreated: $('#studyDateCreated').val() || null,
        Active: true,
        Goal: parseInt($('#studyGoal').val()),
        Phase: parseInt($('#phaseList').val()),
        Indication: $('#studyIndication').val(),
        TherapeuticArea: $('#studyTherapeuticArea').val(),
        BlindingType: parseInt($('#blidingList').val()),
        RandomizationType: parseInt($('#studyDesignList').val()),
        StartDate: $('#studyStartDate').val() || null,
        EndDate: $('#studyEndDate').val() || null,
        StudioStatus: parseInt($('#studystatusList').val()),
        DiseaseId: parseInt($('#diseaseList').val()),
        CROId: parseInt($('#croList').val())
    };

    let studioGData = [];
    studioGData.push(generalData);

    // Clean up date fields - convert empty strings to null
    const cleanedProtocolsData = protocolsData.map(protocol => ({
        ...protocol,
        dateCreated: protocol.dateCreated || null,
        startDate: protocol.startDate || null,
        endDate: protocol.endDate || null,
        approvedDate: protocol.approvedDate || null
    }));

    const cleanedDocumentsData = documentsData.map(doc => ({
        ...doc,
        docDate: doc.docDate || null,
        createdAt: doc.createdAt || null
    }));

    // Clean up monitors data - ensure only MonitorId and Role with PascalCase
    const cleanedMonitorsData = monitorsData.map(monitor => {
        console.log('Original monitor object:', monitor);
        console.log('Monitor properties:', Object.keys(monitor));

        // Get the monitor ID (API returns as 'id')
        const monitorId = monitor.id || monitor.Id || monitor.monitorId || monitor.MonitorId || 0;

        console.log('Extracted monitorId:', monitorId);

        return {
            MonitorId: monitorId,
            Role: monitor.role || monitor.Role || 'Monitor'
        };
    });

    const studioData = {
        STDGeneralData: studioGData,
        STDDocumentation: cleanedDocumentsData,
        STDMonitor: cleanedMonitorsData,
        STDProtocol: cleanedProtocolsData,
        STDArms: armsData,
        STDVisits: visitsData
    };

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=UpdateStudy',  // Changed to UpdateStudy
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "studioData": studioData },
        success: function (data) {
            window.location.href = "/STD/StudioListData";
        },
        failure: function (response) {
            $('#failedTitle').html('Update Study');
            $('#failedMsg').html('Update Study failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Update Study');
            $('#failedMsg').html('Update Study failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
//#endregion

//Monitor...
//#region Monitor

const myMonitorModal = document.getElementById('monitorModal');

myMonitorModal.addEventListener('show.bs.modal', function (event) {
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
                id: parseInt($('#monitorList').val()),
                monitorName: $('#monitorList option:selected').text(),
                role: 'Monitor',
        };

        monitorsData.push(monitor);

        // Clear form fields for existing monitor
        $('#monitorList').val(-1);

        // Reinitialize grid
        initializeMonitorGrid();

        // Close the modal
        $('#monitorModal').modal('hide');
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
                console.log('CrudMonitor response:', data);
                console.log('Returned monitorId:', data.monitorId);

                const monitor = {
                    id: data.monitorId,
                    monitorName: `${firstName} ${lastName}`,
                    role: role,
                };

                console.log('Created monitor object:', monitor);

                monitorsData.push(monitor);

                // Clear new monitor form fields
                $('#firstName').val('');
                $('#lastName').val('');
                $('#email').val('');
                $('#phone').val('');

                hideNewMonitor();

                // Reinitialize grid after adding the monitor
                initializeMonitorGrid();

                // Refresh the monitor dropdown to include the newly created monitor
                getMonitorList();

                // Close the modal
                $('#monitorModal').modal('hide');
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
            { field: "protocol", headerName: "Name", flex: 1 },
            { field: "version", headerName: "Version", flex: 1 },
            {
                field: "startDate",
                headerName: "Start",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            { field: "numVisit", headerName: "Visits", flex: 1 },
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
