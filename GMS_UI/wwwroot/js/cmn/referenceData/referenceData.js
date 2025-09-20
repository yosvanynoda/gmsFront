﻿//#region ====== General ======
//#region general functions create links...
// Helper function to create each action link
function createActionLink(title, href, linkClass, iconClass, mainvalue, secondValue, id, thirdValue, fourValue, fiveValue, sixValue) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;
    //console.log(mainvalue);
    //console.log(secondValue);
    a.addEventListener('click', () => {

        if (href == "#editGender") {
            $('#genderEdit').val(mainvalue);
            $('textarea#commentGenderEdit').val(secondValue);
            $('#genderidEdit').val(id);
        }

        if (href == "#deleteGender") {
            $('#genderD').html(mainvalue);
            $('#commentGenderD').html(secondValue);
            $('#genderidDelete').val(id);
        }

        if (href == "#editAllergy") {
            $('#allergyEdit').val(mainvalue);
            $('textarea#commentAllergyEdit').val(secondValue);
            $('#allergyidEdit').val(id);
        }

        if (href == "#deleteAllergy") {
            $('#allergyD').html(mainvalue);
            $('#commentAllergyD').html(secondValue);
            $('#allergyidDelete').val(id);
        }

        if (href == "#editDisease") {
            $('#diseaseEdit').val(mainvalue);
            $('#diseaseidEdit').val(id);
        }

        if (href == "#deleteDisease") {
            $('#diseaseD').html(mainvalue);
            $('#diseaseidDelete').val(id);
        }

        if (href == "#editMedication") {
            $('#medicationEdit').val(mainvalue);          
            $('#doseEdit').val(secondValue);
            $('#medicationidEdit').val(id);
        }

        if (href == "#deleteMedication") {
            $('#medicationD').html(mainvalue);
            $('#doseD').html(secondValue);
            $('#medicationidDelete').val(id);
        }

        if (href == "#editEthnicity") {
            $('#ethnicityEdit').val(mainvalue);
            $('textarea#commentEthnicityEdit').val(secondValue);
            $('#ethnicityidEdit').val(id);
        }

        if (href == "#deleteEthnicity") {
            $('#ethnicityD').html(mainvalue);
            $('#commentEthnicityD').html(secondValue);
            $('#ethnicityidDelete').val(id);
        }

        if (href == "#editLanguage") {
            $('#languageEdit').val(mainvalue);
            $('textarea#commentLanguageEdit').val(secondValue);
            $('#languageidEdit').val(id);
        }

        if (href == "#deleteLanguage") {
            $('#languageD').html(mainvalue);
            $('#commentLanguageD').html(secondValue);
            $('#languageidDelete').val(id);
        }

        if (href == "#editRace") {
            $('#raceEdit').val(mainvalue);
            $('textarea#commentRaceEdit').val(secondValue);
            $('#raceidEdit').val(id);
        }

        if (href == "#deleteRace") {
            $('#raceD').html(mainvalue);
            $('#commentRaceD').html(secondValue);
            $('#raceidDelete').val(id);
        }

        if (href == "#editRelationType") {
            $('#relationTypeEdit').val(mainvalue);
            $('#relationTypeidEdit').val(id);
        }

        if (href == "#deleteRelationType") {
            $('#relationTypeD').html(mainvalue);
            $('#relationTypeidDelete').val(id);
        }

        if (href == "#editRoleType") {
            $('#roleTypeEdit').val(mainvalue);
            $('#roleTypeidEdit').val(id);
        }

        if (href == "#deleteRoleType") {
            $('#roleTypeD').html(mainvalue);
            $('#roleTypeidDelete').val(id);
        }

        if (href == "#editSponsorType") {
            $('#sponsorTypeEdit').val(mainvalue);
            $('#sponsorTypeidEdit').val(id);
        }

        if (href == "#deleteSponsorType") {
            $('#sponsorTypeD').html(mainvalue);
            $('#sponsorTypeidDelete').val(id);
        }

        if (href == "#editTaskType") {
            $('#taskTypeEdit').val(mainvalue);
            $('#taskTypeidEdit').val(id);
        }

        if (href == "#deleteTaskType") {
            $('#taskTypeD').html(mainvalue);
            $('#taskTypeidDelete').val(id);
        }

        if (href == "#editTask") {
            $('#taskEdit').val(mainvalue);
            
            $('#taskidEdit').val(id);

            console.log(secondValue);

            $('#taskTidEdit').val(secondValue);

            //call here the task type get data to add to combo
            //setupComboTaskType(secondValue);

        //    $("#taskTypeList option[value=" + secondValue + "]").prop("selected", "selected")
        }

        if (href == "#deleteTask") {
            $('#taskD').html(mainvalue);
            $('#taskT').html(secondValue);
            $('#taskidDelete').val(id);
        }

        if (href == "#editDocType") {
            $('#docTypeEdit').val(mainvalue);
            $('textarea#commentDocTypeEdit').val(secondValue);
            //$('#applyForD').html(thirdValue);
            $('#applyforListEdit option[value=' + thirdValue  +']').attr('selected', 'selected');
            $('#docTypeidEdit').val(id);
        }

        if (href == "#deleteDocType") {
            $('#docTypeD').html(mainvalue);
            $('#commentDocTypeD').html(secondValue);
            $('#applyForD').html(thirdValue);
            $('#docTypeidDelete').val(id);
        }

        if (href == "#editSite") {
            $('#siteNameEdit').val(mainvalue);
            $('#siteAddressEdit').val(secondValue);
            $('#siteContactEdit').val(thirdValue);
            $('#sitePhoneEdit').val(fourValue);
            $('#siteEmailEdit').val(fiveValue);
            $('#siteCodeEdit').val(sixValue);
            
            $('#siteidEdit').val(id);
        }

        if (href == "#deleteSite") {
            $('#siteNameD').html(mainvalue);
            $('#siteAddressD').html(secondValue);
            $('#siteContactD').html(thirdValue);
            $('#sitePhoneD').html(fourValue);
            $('#siteEmailD').html(fiveValue);
            $('#siteCodeD').html(sixValue);
            $('#siteidDelete').val(id);
        }

        $(href).modal('show');
    });
    a.appendChild(icon);

    return a;
}

function hideAlerts(alertName) {
    $('#' + alertName).hide();
}

//#endregion
//#endregion

//#region ====== Gender =======

//#region Grid...
class GenderButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editGender', 'link-success', 'bi bi-pencil-fill', params.data.gender, params.data.comment, params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteGender', 'link-danger', 'bi bi-x-octagon-fill', params.data.gender, params.data.comment, params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridGenderApi;


// Grid Options: Contains all of the grid configurations
const gridGenderOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "gender", filter: 'agTextColumnFilter' },
        { field: "comment", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: GenderButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

function getGenderList() {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=GenderList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupGenderGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Gender');
            $('#failedMsg').html('Gender failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Gender');
            $('#failedMsg').html('Gender failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupGenderGrid(data) {
    //console.log(data);
    $('#genderGrid').html('');
    gridGenderOptions.rowData = data;
    gridGenderApi = agGrid.createGrid(document.querySelector("#genderGrid"), gridGenderOptions);
    //alert('done');
}
//#endregion



//#region Add Gender

function crudGender(action) {
    $('#validateGender').html('');
    $('#validateGenderEdit').html('');
    let gender = '';
    let comment = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            gender = $("#gender").val();
            if (gender === "") {
                $('#validateGender').html('Please enter an gender');
                $('#validateGender').show();
                return;
            }
            comment = $("textarea#commentGender").val();
            id = 0; // New gender, so id is 0
            $('#gender').val('');
            $('textarea#commentGender').val('');
            $('#genderNewModal').modal('hide');
            break;
        case 2: // Edit
            gender = $("#genderEdit").val();
            if (gender === "") {
                $('#validateGenderEdit').html('Please enter an gender');
                $('#validateGenderEdit').show();
                return;
            }
            comment = $("textarea#commentGenderEdit").val();
            id = $("#genderidEdit").val(); // Get the id from the hidden input
            $('#genderEdit').val('');
            $('textarea#commentGenderEdit').val('');
            $('#genderidEdit').val('');
            $('#editGender').modal('hide');
            break;
        case 3: // Delete
            gender = 'N/A';
            id = $("#genderidDelete").val(); // Get the id from the hidden input
            $('#genderidDelete').val('');
            $('#deleteGender').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudGender',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "gender": gender, "comment": comment, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Gender');
                $('#failedMsg').html('Gender failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Gender');
                $('#successMsg').html('Gender was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=GenderList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGenderGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Gender');
                        $('#failedMsg').html('Gender failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Gender');
                        $('#failedMsg').html('Gender failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Gender');
            $('#failedMsg').html('Gender failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Gender');
            $('#failedMsg').html('Gender failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
//#endregion

//#endregion

//#region ====== Allergy =======

//#region Grid...
class AllergyButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editAllergy', 'link-success', 'bi bi-pencil-fill', params.data.allergy, params.data.comment, params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteAllergy', 'link-danger', 'bi bi-x-octagon-fill', params.data.allergy, params.data.comment, params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridAllergyApi;


// Grid Options: Contains all of the grid configurations
const gridAllergyOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "allergy", filter: 'agTextColumnFilter' },
        { field: "comment", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: AllergyButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


function getAllergyList() {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=AllergyList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupAllergyGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Allergy');
            $('#failedMsg').html('Allergy failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Allergy');
            $('#failedMsg').html('Allergy failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupAllergyGrid(data) {
    // console.log(data);
        $('#allergyGrid').html('');
        gridAllergyOptions.rowData = data;
        gridAllergyApi = agGrid.createGrid(document.querySelector("#allergyGrid"), gridAllergyOptions);   
        //alert('done');
    }
    //#endregion

//#region Add Allergy

function crudAllergy(action) {
    $('#validateAllergy').html('');
    $('#validateAllergyEdit').html('');
    let allergy = '';
    let comment = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            allergy = $("#allergy").val();
            if (allergy === "") {
                $('#validateAllergy').html('Please enter an allergy');
                $('#validateAllergy').show();
                return;
            }
            comment = $("textarea#commentAllergy").val();
            id = 0; // New allergy, so id is 0
            $('#allergy').val('');
            $('textarea#commentAllergy').val('');
            $('#allergyNewModal').modal('hide');
            break;
        case 2: // Edit
            allergy = $("#allergyEdit").val();
            if (allergy === "") {
                $('#validateAllergyEdit').html('Please enter an allergy');
                $('#validateAllergyEdit').show();
                return;
            }
            comment = $("textarea#commentAllergyEdit").val();
            id = $("#allergyidEdit").val(); // Get the id from the hidden input
            $('#allergyEdit').val('');
            $('textarea#commentAllergyEdit').val('');
            $('#allergyidEdit').val('');
            $('#editAllergy').modal('hide');
            break;
        case 3: // Delete
            allergy = 'N/A';
            id = $("#allergyidDelete").val(); // Get the id from the hidden input
            $('#allergyidDelete').val('');
            $('#deleteAllergy').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudAllergy',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "allergy": allergy, "comment": comment, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Allergy');
                $('#failedMsg').html('Allergy failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Allergy');
                $('#successMsg').html('Allergy was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=AllergyList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupAllergyGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Allergy');
                        $('#failedMsg').html('Allergy failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Allergy');
                        $('#failedMsg').html('Allergy failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Allergy');
            $('#failedMsg').html('Allergy failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Allergy');
            $('#failedMsg').html('Allergy failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion

//#endregion

//#region ====== Disease =======

//#region Grid...
class DiseaseButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editDisease', 'link-success', 'bi bi-pencil-fill', params.data.diseaseName, '', params.data.diseaseId);
        const deleteLink = createActionLink('Delete', '#deleteDisease', 'link-danger', 'bi bi-x-octagon-fill', params.data.diseaseName, '', params.data.diseaseId);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridDiseaseApi;

// Grid Options: Contains all of the grid configurations
const gridDiseaseOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "diseaseId", filter: 'agTextColumnFilter', hide: true },
        { field: "diseaseName", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: DiseaseButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getDiseaseList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=DiseaseList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupDiseaseGrid(data.data);
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

function setupDiseaseGrid(data) {
    //console.log(data);
    $('#diseaseGrid').html('');
    gridDiseaseOptions.rowData = data;
    gridDieaseApi = agGrid.createGrid(document.querySelector("#diseaseGrid"), gridDiseaseOptions);
    //alert('done');
}
//#endregion

//#region Add Disease

function crudDisease(action) {
    $('#validateDisease').html('');
    $('#validateDiseaseEdit').html('');
    let disease = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            disease = $("#disease").val();
            if (disease === "") {
                $('#validateDisease').html('Please enter an disease');
                $('#validateDisease').show();
                return;
            }
            id = 0; // New disease, so id is 0
            $('#disease').val('');
            $('#diseaseNewModal').modal('hide');
            break;
        case 2: // Edit
            disease = $("#diseaseEdit").val();
            if (disease === "") {
                $('#validateDiseaseEdit').html('Please enter an disease');
                $('#validateDiseaseEdit').show();
                return;
            }
            id = $("#diseaseidEdit").val(); // Get the id from the hidden input
            $('#diseaseEdit').val('');
            $('#diseaseidEdit').val('');
            $('#editDisease').modal('hide');
            break;
        case 3: // Delete
            disease = 'N/A';
            id = $("#diseaseidDelete").val(); // Get the id from the hidden input
            $('#diseaseidDelete').val('');
            $('#deleteDisease').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudDisease',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "disease": disease, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Disease');
                $('#failedMsg').html('Disease failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Disease');
                $('#successMsg').html('Disease was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=DiseaseList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupDiseaseGrid(data.data);
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

//#endregion
//#endregion

//#region ====== Medication =======

//#region Grid...
class MedicationButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editMedication', 'link-success', 'bi bi-pencil-fill', params.data.medicationName, params.data.medicationDose, params.data.medicationId);
        const deleteLink = createActionLink('Delete', '#deleteMedication', 'link-danger', 'bi bi-x-octagon-fill', params.data.medicationName, params.data.medicationDose, params.data.medicationId);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridMedicationApi;

// Grid Options: Contains all of the grid configurations
const gridMedicationOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "medicationId", filter: 'agTextColumnFilter', hide: true },
        { field: "medicationName", filter: 'agTextColumnFilter' },
        { field: "medicationDose", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: MedicationButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getMedicationList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=MedicationList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupMedicationGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Medication');
            $('#failedMsg').html('Medication failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Medication');
            $('#failedMsg').html('Medication failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupMedicationGrid(data) {
    console.log(data);
    $('#medicationGrid').html('');
    gridMedicationOptions.rowData = data;
    gridDieaseApi = agGrid.createGrid(document.querySelector("#medicationGrid"), gridMedicationOptions);
    //alert('done');
}
//#endregion

//#region Add Medication

function crudMedication(action) {
    $('#validateMedication').html('');
    $('#validateMedicationEdit').html('');
    let medication = '';
    let dose = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            medication = $("#medication").val();
            if (medication === "") {
                $('#validateMedication').html('Please enter a medication');
                $('#validateMedication').show();
                return;
            }
            dose = $('#dose').val();
            if (dose === "") {
                $('#validateDose').html('Please enter a dose');
                $('#validateDose').show();
                return;
            }
            id = 0; // New medication, so id is 0
            $('#medication').val('');
            $('#medicationNewModal').modal('hide');
            break;
        case 2: // Edit
            medication = $("#medicationEdit").val();
            if (medication === "") {
                $('#validateMedicationEdit').html('Please enter a medication');
                $('#validateMedicationEdit').show();
                return;
            }
            dose = $("#doseEdit").val();
            if (dose === "") {
                $('#validateDoseEdit').html('Please enter a dose');
                $('#validateDoseEdit').show();
                return;
            }
            id = $("#medicationidEdit").val(); // Get the id from the hidden input
            $('#medicationEdit').val('');
            $('#medicationidEdit').val('');
            $('#editMedication').modal('hide');
            break;
        case 3: // Delete
            medication = 'N/A';
            dose = 'N/A';
            id = $("#medicationidDelete").val(); // Get the id from the hidden input
            $('#medicationidDelete').val('');
            $('#deleteMedication').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudMedication',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {"medication": medication, "dose": dose, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Medication');
                $('#failedMsg').html('Medication failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Medication');
                $('#successMsg').html('Medication was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=MedicationList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupMedicationGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Medication');
                        $('#failedMsg').html('Medication failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Medication');
                        $('#failedMsg').html('Medication failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Medication');
            $('#failedMsg').html('Medication failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Medication');
            $('#failedMsg').html('Medication failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion
//#endregion

//#region ====== Ethnicity =======

//#region Grid...
class EthnicityButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editEthnicity', 'link-success', 'bi bi-pencil-fill', params.data.ethnicity, params.data.comment, params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteEthnicity', 'link-danger', 'bi bi-x-octagon-fill', params.data.ethnicity, params.data.comment, params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridEthnicityApi;


// Grid Options: Contains all of the grid configurations
const gridEthnicityOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "ethnicity", filter: 'agTextColumnFilter' },
        { field: "comment", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: EthnicityButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


window.getEthnicityList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=EthnicityList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupEthnicityGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Ethnicity');
            $('#failedMsg').html('Ethnicity failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Ethnicity');
            $('#failedMsg').html('Ethnicity failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupEthnicityGrid(data) {
    //console.log(data);
    $('#ethnicityGrid').html('');
    gridEthnicityOptions.rowData = data;
    gridEthnicityApi = agGrid.createGrid(document.querySelector("#ethnicityGrid"), gridEthnicityOptions);
    //alert('done');
}
//#endregion

//#region Add Ethnicity

function crudEthnicity(action) {
    $('#validateEthnicity').html('');
    $('#validateEthnicityEdit').html('');
    let ethnicity = '';
    let comment = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            ethnicity = $("#ethnicity").val();
            if (ethnicity === "") {
                $('#validateEthnicity').html('Please enter an ethnicity');
                $('#validateEthnicity').show();
                return;
            }
            comment = $("textarea#commentEthnicity").val();
            id = 0; // New ethnicity, so id is 0
            $('#ethnicity').val('');
            $('textarea#commentEthnicity').val('');
            $('#ethnicityNewModal').modal('hide');
            break;
        case 2: // Edit
            ethnicity = $("#ethnicityEdit").val();
            if (ethnicity === "") {
                $('#validateEthnicityEdit').html('Please enter an ethnicity');
                $('#validateEthnicityEdit').show();
                return;
            }
            comment = $("textarea#commentEthnicityEdit").val();
            id = $("#ethnicityidEdit").val(); // Get the id from the hidden input
            $('#ethnicityEdit').val('');
            $('textarea#commentEthnicityEdit').val('');
            $('#ethnicityidEdit').val('');
            $('#editEthnicity').modal('hide');
            break;
        case 3: // Delete
            ethnicity = 'N/A';
            id = $("#ethnicityidDelete").val(); // Get the id from the hidden input
            $('#ethnicityidDelete').val('');
            $('#deleteEthnicity').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudEthnicity',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "ethnicity": ethnicity, "comment": comment, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Ethnicity');
                $('#failedMsg').html('Ethnicity failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Ethnicity');
                $('#successMsg').html('Ethnicity was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=EthnicityList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupEthnicityGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Ethnicity');
                        $('#failedMsg').html('Ethnicity failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Ethnicity');
                        $('#failedMsg').html('Ethnicity failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Ethnicity');
            $('#failedMsg').html('Ethnicity failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Ethnicity');
            $('#failedMsg').html('Ethnicity failed. Please try again');
            $('#failedAlert').show();
        }
    });

}
//#endregion
//#endregion

//#region ====== Language =======

//#region Grid...
class LanguageButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editLanguage', 'link-success', 'bi bi-pencil-fill', params.data.language, params.data.comment, params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteLanguage', 'link-danger', 'bi bi-x-octagon-fill', params.data.language, params.data.comment, params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridLanguageApi;


// Grid Options: Contains all of the grid configurations
const gridLanguageOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "language", filter: 'agTextColumnFilter' },
        { field: "comment", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: LanguageButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


function getLanguageList() {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=LanguageList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupLanguageGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Language');
            $('#failedMsg').html('Language failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Language');
            $('#failedMsg').html('Language failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupLanguageGrid(data) {
     console.log(data);
    $('#languageGrid').html('');
    gridLanguageOptions.rowData = data;
    gridLanguageApi = agGrid.createGrid(document.querySelector("#languageGrid"), gridLanguageOptions);
    //alert('done');
}
//#endregion

//#region Add Language

function crudLanguage(action) {
    $('#validateLanguage').html('');
    $('#validateLanguageEdit').html('');
    let language = '';
    let comment = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            language = $("#language").val();
            if (language === "") {
                $('#validateLanguage').html('Please enter an language');
                $('#validateLanguage').show();
                return;
            }
            comment = $("textarea#commentLanguage").val();
            id = 0; // New language, so id is 0
            $('#language').val('');
            $('textarea#commentLanguage').val('');
            $('#languageNewModal').modal('hide');
            break;
        case 2: // Edit
            language = $("#languageEdit").val();
            if (language === "") {
                $('#validateLanguageEdit').html('Please enter an language');
                $('#validateLanguageEdit').show();
                return;
            }
            comment = $("textarea#commentLanguageEdit").val();
            id = $("#languageidEdit").val(); // Get the id from the hidden input
            $('#languageEdit').val('');
            $('textarea#commentLanguageEdit').val('');
            $('#languageidEdit').val('');
            $('#editLanguage').modal('hide');
            break;
        case 3: // Delete
            language = 'N/A';
            id = $("#languageidDelete").val(); // Get the id from the hidden input
            $('languageidDelete').val('');
            $('#deleteLanguage').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudLanguage',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "language": language, "comment": comment, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Language');
                $('#failedMsg').html('Language failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Language');
                $('#successMsg').html('Language was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=LanguageList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupLanguageGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Language');
                        $('#failedMsg').html('Language failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Language');
                        $('#failedMsg').html('Language failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Language');
            $('#failedMsg').html('Language failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Language');
            $('#failedMsg').html('Language failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion

//#endregion

//#region ====== Race =======

//#region Grid...
class RaceButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editRace', 'link-success', 'bi bi-pencil-fill', params.data.race, params.data.comment, params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteRace', 'link-danger', 'bi bi-x-octagon-fill', params.data.race, params.data.comment, params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridRaceApi;


// Grid Options: Contains all of the grid configurations
const gridRaceOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "race", filter: 'agTextColumnFilter' },
        { field: "comment", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: RaceButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


window.getRaceList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=RaceList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupRaceGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Race');
            $('#failedMsg').html('Race failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Race');
            $('#failedMsg').html('Race failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
function setupRaceGrid(data) {
    //console.log(data);
    $('#raceGrid').html('');
    gridRaceOptions.rowData = data;
    gridRaceApi = agGrid.createGrid(document.querySelector("#raceGrid"), gridRaceOptions);
    //alert('done');
}
//#endregion

//#region Add Race

function crudRace(action) {
    $('#validateRace').html('');
    $('#validateRaceEdit').html('');
    let race = '';
    let comment = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            race = $("#race").val();
            if (race === "") {
                $('#validateRace').html('Please enter an race');
                $('#validateRace').show();
                return;
            }
            comment = $("textarea#commentRace").val();
            id = 0; // New race, so id is 0
            $('#race').val('');
            $('textarea#commentRace').val('');
            $('#raceNewModal').modal('hide');
            break;
        case 2: // Edit
            race = $("#raceEdit").val();
            if (race === "") {
                $('#validateRaceEdit').html('Please enter an race');
                $('#validateRaceEdit').show();
                return;
            }
            comment = $("textarea#commentRaceEdit").val();
            id = $("#raceidEdit").val(); // Get the id from the hidden input
            $('#raceEdit').val('');
            $('textarea#commentRaceEdit').val('');
            $('#raceidEdit').val('');
            $('#editRace').modal('hide');
            break;
        case 3: // Delete
            race = 'N/A';
            id = $("#raceidDelete").val(); // Get the id from the hidden input
            $('#raceidDelete').val('');
            $('#deleteRace').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudRace',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "race": race, "comment": comment, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Race');
                $('#failedMsg').html('Race failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Race');
                $('#successMsg').html('Race was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=RaceList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupRaceGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Race');
                        $('#failedMsg').html('Race failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Race');
                        $('#failedMsg').html('Race failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Race');
            $('#failedMsg').html('Race failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Race');
            $('#failedMsg').html('Race failed. Please try again');
            $('#failedAlert').show();
        }
    });


}

//#endregion

//#endregion

//#region ====== Relation Type =======

//#region Grid...
class RelationTypeButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editRelationType', 'link-success', 'bi bi-pencil-fill', params.data.relationType, '', params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteRelationType', 'link-danger', 'bi bi-x-octagon-fill', params.data.relationType, '', params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridRelationTypeApi;


// Grid Options: Contains all of the grid configurations
const gridRelationTypeOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "relationType", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: RelationTypeButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


window.getRelationTypeList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=RelationTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupRelationTypeGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('RelationType');
            $('#failedMsg').html('RelationType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('RelationType');
            $('#failedMsg').html('RelationType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupRelationTypeGrid(data) {
    console.log(data);
    $('#relationTypeGrid').html('');
    gridRelationTypeOptions.rowData = data;
    gridRelationTypeApi = agGrid.createGrid(document.querySelector("#relationTypeGrid"), gridRelationTypeOptions);
    //alert('done');
}
//#endregion

//#region Add RelationType

function crudRelationType(action) {
    $('#validateRelationType').html('');
    $('#validateRelationTypeEdit').html('');
    let relationType = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            relationType = $("#relationType").val();
            if (relationType === "") {
                $('#validateRelationType').html('Please enter an relation type');
                $('#validateRelationType').show();
                return;
            }

            id = 0; // New relationType, so id is 0
            $('#relationType').val('');
            $('#relationTypeNewModal').modal('hide');
            break;
        case 2: // Edit
            relationType = $("#relationTypeEdit").val();
            if (relationType === "") {
                $('#validateRelationTypeEdit').html('Please enter an relation type');
                $('#validateRelationTypeEdit').show();
                return;
            }

            id = $("#relationTypeidEdit").val(); // Get the id from the hidden input
            $('#relationTypeEdit').val('');
            $('#relationTypeidEdit').val('');
            $('#editRelationType').modal('hide');
            break;
        case 3: // Delete
            relationType = 'N/A';
            id = $("#relationTypeidDelete").val(); // Get the id from the hidden input
            $('#relationTypeidDelete').val('');
            $('#deleteRelationType').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudRelationType',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "relationType": relationType, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('RelationType');
                $('#failedMsg').html('RelationType failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('RelationType');
                $('#successMsg').html('RelationType was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=RelationTypeList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupRelationTypeGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('RelationType');
                        $('#failedMsg').html('RelationType failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('RelationType');
                        $('#failedMsg').html('RelationType failed. Please try again');
                        $('#failedAlert').show();
                    }
                });


            }
        },
        failure: function (response) {
            $('#failedTitle').html('RelationType');
            $('#failedMsg').html('RelationType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('RelationType');
            $('#failedMsg').html('RelationType failed. Please try again');
            $('#failedAlert').show();
        }
    });


}



//#endregion

//#endregion

//#region ====== Role Type =======


//#region Grid...
class RoleTypeButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editRoleType', 'link-success', 'bi bi-pencil-fill', params.data.roleType, '', params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteRoleType', 'link-danger', 'bi bi-x-octagon-fill', params.data.roleType, '', params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridRoleTypeApi;

// Grid Options: Contains all of the grid configurations
const gridRoleTypeOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "roleType", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: RoleTypeButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getRoleTypeList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=RoleTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupRoleTypeGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('RoleType');
            $('#failedMsg').html('RoleType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('RoleType');
            $('#failedMsg').html('RoleType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupRoleTypeGrid(data) {
    //console.log(data);
    $('#roleTypeGrid').html('');
    gridRoleTypeOptions.rowData = data;
    gridRoleTypeApi = agGrid.createGrid(document.querySelector("#roleTypeGrid"), gridRoleTypeOptions);
    //alert('done');
}
//#endregion

//#region Add RoleType

function crudRoleType(action) {
    $('#validateRoleType').html('');
    $('#validateRoleTypeEdit').html('');
    let roleType = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            roleType = $("#roleType").val();
            if (roleType === "") {
                $('#validateRoleType').html('Please enter an roleType');
                $('#validateRoleType').show();
                return;
            }
            id = 0; // New RoleType, so id is 0
            $('#roleType').val('');
            $('#roleTypeNewModal').modal('hide');
            break;
        case 2: // Edit
            roleType = $("#roleTypeEdit").val();
            if (roleType === "") {
                $('#validateRoleTypeEdit').html('Please enter an roleType');
                $('#validateRoleTypeEdit').show();
                return;
            }
            id = $("#roleTypeidEdit").val(); // Get the id from the hidden input
            $('#roleTypeEdit').val('');
            $('#roleTypeidEdit').val('');
            $('#editRoleType').modal('hide');
            break;
        case 3: // Delete
            roleType = 'N/A';
            id = $("#roleTypeidDelete").val(); // Get the id from the hidden input
            $('#roleTypeidDelete').val('');
            $('#deleteRoleType').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudRoleType',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "roleType": roleType, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('RoleType');
                $('#failedMsg').html('RoleType failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('RoleType');
                $('#successMsg').html('RoleType was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=RoleTypeList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupRoleTypeGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('RoleType');
                        $('#failedMsg').html('RoleType failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('RoleType');
                        $('#failedMsg').html('RoleType failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('RoleType');
            $('#failedMsg').html('RoleType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('RoleType');
            $('#failedMsg').html('RoleType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion
//#endregion

//#region ====== Sponsor Type =======


//#region Grid...
class SponsorTypeButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editSponsorType', 'link-success', 'bi bi-pencil-fill', params.data.sponsorType, '', params.data.id);
        const deleteLink = createActionLink('Delete', '#deleteSponsorType', 'link-danger', 'bi bi-x-octagon-fill', params.data.sponsorType, '', params.data.id);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridSponsorTypeApi;

// Grid Options: Contains all of the grid configurations
const gridSponsorTypeOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "sponsorType", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: SponsorTypeButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
window.getSponsorTypeList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SponsorTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupSponsorTypeGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('SponsorType');
            $('#failedMsg').html('SponsorType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('SponsorType');
            $('#failedMsg').html('SponsorType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupSponsorTypeGrid(data) {
    console.log(data);
    $('#sponsorTypeGrid').html('');
    gridSponsorTypeOptions.rowData = data;
    gridSponsorTypeApi = agGrid.createGrid(document.querySelector("#sponsorTypeGrid"), gridSponsorTypeOptions);
    //alert('done');
}
//#endregion

//#region Add SponsorType

function crudSponsorType(action) {
    $('#validateSponsorType').html('');
    $('#validateSponsorTypeEdit').html('');
    let sponsorType = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            sponsorType = $("#sponsorType").val();
            if (sponsorType === "") {
                $('#validateSponsorType').html('Please enter an sponsorType');
                $('#validateSponsorType').show();
                return;
            }
            id = 0; // New SponsorType, so id is 0
            $('#sponsorType').val('');
            $('#sponsorTypeNewModal').modal('hide');
            break;
        case 2: // Edit
            sponsorType = $("#sponsorTypeEdit").val();
            if (sponsorType === "") {
                $('#validateSponsorTypeEdit').html('Please enter an sponsorType');
                $('#validateSponsorTypeEdit').show();
                return;
            }
            id = $("#sponsorTypeidEdit").val(); // Get the id from the hidden input
            $('#sponsorTypeEdit').val('');
            $('#sponsorTypeidEdit').val('');
            $('#editSponsorType').modal('hide');
            break;
        case 3: // Delete
            sponsorType = 'N/A';
            id = $("#sponsorTypeidDelete").val(); // Get the id from the hidden input
            $('#sponsorTypeidDelete').val('');
            $('#deleteSponsorType').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudSponsorType',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "sponsorType": sponsorType, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('SponsorType');
                $('#failedMsg').html('SponsorType failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('SponsorType');
                $('#successMsg').html('SponsorType was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=SponsorTypeList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupSponsorTypeGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('SponsorType');
                        $('#failedMsg').html('SponsorType failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('SponsorType');
                        $('#failedMsg').html('SponsorType failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('SponsorType');
            $('#failedMsg').html('SponsorType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('SponsorType');
            $('#failedMsg').html('SponsorType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion
//#endregion

//#region ====== Task Type =======

//#region Grid...
class TaskTypeButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editTaskType', 'link-success', 'bi bi-pencil-fill', params.data.taskTypeName, '', params.data.taskTypeId);
        const deleteLink = createActionLink('Delete', '#deleteTaskType', 'link-danger', 'bi bi-x-octagon-fill', params.data.taskTypeName, '', params.data.taskTypeId);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridTaskTypeApi;

// Grid Options: Contains all of the grid configurations
const gridTaskTypeOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "taskTypeId", filter: 'agTextColumnFilter', hide: true },
        { field: "taskTypeName", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: TaskTypeButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getTaskTypeList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=TaskTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupTaskTypeGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupTaskTypeGrid(data) {
    console.log(data);
    $('#taskTypeGrid').html('');
    gridTaskTypeOptions.rowData = data;
    gridTaskTypeApi = agGrid.createGrid(document.querySelector("#taskTypeGrid"), gridTaskTypeOptions);
    //alert('done');
}
//#endregion

//#region Add TaskType

function crudTaskType(action) {
    $('#validateTaskType').html('');
    $('#validateTaskTypeEdit').html('');
    let taskType = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            taskType = $("#taskType").val();
            if (taskType === "") {
                $('#validateTaskType').html('Please enter an taskType');
                $('#validateTaskType').show();
                return;
            }
            id = 0; // New TaskType, so id is 0
            $('#taskType').val('');
            $('#taskTypeNewModal').modal('hide');
            break;
        case 2: // Edit
            taskType = $("#taskTypeEdit").val();
            if (taskType === "") {
                $('#validateTaskTypeEdit').html('Please enter an taskType');
                $('#validateTaskTypeEdit').show();
                return;
            }
            id = $("#taskTypeidEdit").val(); // Get the id from the hidden input
            $('#taskTypeEdit').val('');
            $('#taskTypeidEdit').val('');
            $('#editTaskType').modal('hide');
            break;
        case 3: // Delete
            taskType = 'N/A';
            id = $("#taskTypeidDelete").val(); // Get the id from the hidden input
            $('#taskTypeidDelete').val('');
            $('#deleteTaskType').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudTaskType',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "taskType": taskType, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('TaskType');
                $('#failedMsg').html('TaskType failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('TaskType');
                $('#successMsg').html('TaskType was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=TaskTypeList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupTaskTypeGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('TaskType');
                        $('#failedMsg').html('TaskType failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('TaskType');
                        $('#failedMsg').html('TaskType failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion
//#endregion

//#region ====== Task  =======

//#region Grid...
class TaskButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editTask', 'link-success', 'bi bi-pencil-fill', params.data.taskName, params.data.taskTypeId, params.data.taskId);
        const deleteLink = createActionLink('Delete', '#deleteTask', 'link-danger', 'bi bi-x-octagon-fill', params.data.taskName, params.data.taskTypeName, params.data.taskId);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridTaskApi;

// Grid Options: Contains all of the grid configurations
const gridTaskOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "taskId", filter: 'agTextColumnFilter', hide: true },
        { field: "taskName", filter: 'agTextColumnFilter' },
        { field: "taskTypeName", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "taskTypeId", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: TaskButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getTaskList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=TaskList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupTaskGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Task');
            $('#failedMsg').html('Task failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Task');
            $('#failedMsg').html('Task failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupTaskGrid(data) {
    //console.log(data);
    $('#taskGrid').html('');
    gridTaskOptions.rowData = data;
    gridTaskApi = agGrid.createGrid(document.querySelector("#taskGrid"), gridTaskOptions);
    //alert('done');
}

function setupComboTaskType(selectedValue, comboName) {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=TaskTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)
            $(comboName).empty();

            if (selectedValue == -1) {
                $(comboName).append($(`<option value=-1 selected="selected">Please select an option</option>`))
            }


            // Loop through data and append options
            $.each(data.data, function (index, item) {
                if (item.taskTypeId == selectedValue) {
                    $(comboName).append($(`<option value=${item.taskTypeId} selected="selected">${item.taskTypeName}</option>`))
                }
                else {
                    $(comboName).append($('<option>', {
                        value: item.taskTypeId,
                        text: item.taskTypeName
                    }));
                }
               
            });
        },
        failure: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('TaskType');
            $('#failedMsg').html('TaskType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
//#endregion

//#region Add Task

function crudTask(action) {
    $('#validateTask').html('');
    $('#validateTaskEdit').html('');
    let task = '';
    let id = 0;
    let taskTId = 0;
    switch (action) {
        case 1: // Add
            task = $("#task").val();
            if (task === "") {
                $('#validateTask').html('Please enter a task');
                $('#validateTask').show();
                return;
            }
            id = 0; // New Task, so id is 0
            taskTId = $('#taskTypeList').find(":selected").val();
            if (taskTId == -1) {
                $('#validateTaskT').html('Please select a task type');
                $('#validateTaskT').show();
                return;
            }
            $('#task').val('');
            $('#taskNewModal').modal('hide');
            break;
        case 2: // Edit
            task = $("#taskEdit").val();
            if (task === "") {
                $('#validateTaskEdit').html('Please enter a task');
                $('#validateTaskEdit').show();
                return;
            }
            id = $("#taskidEdit").val(); // Get the id from the hidden input
            taskTId = $('#taskTypeListEdit').find(":selected").val();
            $('#taskEdit').val('');
            $('#taskidEdit').val('');
            $('#editTask').modal('hide');
            break;
        case 3: // Delete
            task = 'N/A';
            id = $("#taskidDelete").val(); // Get the id from the hidden input
            $('#taskidDelete').val('');
            $('#deleteTask').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudTask',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "taskName": task, "action": action, "id": id, "taskTypeId": taskTId },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Task');
                $('#failedMsg').html('Task failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Task');
                $('#successMsg').html('Task was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=TaskList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupTaskGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Task');
                        $('#failedMsg').html('Task failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Task');
                        $('#failedMsg').html('Task failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Task');
            $('#failedMsg').html('Task failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Task');
            $('#failedMsg').html('Task failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion

//#region modal add task...
$('#taskNewModal').on('shown.bs.modal', function (e) {
    setupComboTaskType(-1, '#taskTypeList')
});

$('#editTask').on('shown.bs.modal', function (e) {
    let ttid = $('#taskTidEdit').val();
    setupComboTaskType(ttid, '#taskTypeListEdit');
});
//#endregion


//#endregion

//#region ====== Document Type =======


//#region Grid...
class DocTypeButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editDocType', 'link-success', 'bi bi-pencil-fill', params.data.docType, params.data.comment, params.data.id, params.data.applyForId);
        const deleteLink = createActionLink('Delete', '#deleteDocType', 'link-danger', 'bi bi-x-octagon-fill', params.data.docType, params.data.comment, params.data.id, params.data.applyFor);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridDocTypeApi;

// Grid Options: Contains all of the grid configurations
const gridDocTypeOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "docType", filter: 'agTextColumnFilter' },
        { field: "applyFor", filter: 'agTextColumnFilter' },     
        { field: "comment", filter: 'agTextColumnFilter' }, 
        { field: "companyId", filter: true, hide: true },
        { field: "applyForId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: DocTypeButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object

window.getDocTypeList = function () {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=DocTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            setupDocTypeGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('DocType');
            $('#failedMsg').html('DocType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('DocType');
            $('#failedMsg').html('DocType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupDocTypeGrid(data) {
    //console.log(data);
    $('#docTypeGrid').html('');
    gridDocTypeOptions.rowData = data;
    gridDocTypeApi = agGrid.createGrid(document.querySelector("#docTypeGrid"), gridDocTypeOptions);
    //alert('done');
}
//#endregion

//#region Add DocType

function crudDocType(action) {
    $('#validateDocType').html('');
    $('#validateDocTypeEdit').html('');
    let docType = '';
    let id = 0;
    let applyFor = 0;
    let comment = '';
    switch (action) {
        case 1: // Add
            docType = $("#docType").val();
            if (docType === "") {
                $('#validateDocType').html('Please enter an docType');
                $('#validateDocType').show();
                return;
            }
            id = 0; // New DocType, so id is 0
            applyFor = $('#applyList').find(":selected").val();
            if (applyFor == -1) {
                $('#validateDocTypeApply').html('Please select an apply for');
                $('#validateDocTypeApply').show();
                return;
            }
            comment = $('textarea#commentDocType').val();
            $('#docType').val('');
            $('#docTypeNewModal').modal('hide');
            break;
        case 2: // Edit
            docType = $("#docTypeEdit").val();
            if (docType === "") {
                $('#validateDocTypeEdit').html('Please enter an docType');
                $('#validateDocTypeEdit').show();
                return;
            }
            id = $("#docTypeidEdit").val(); // Get the id from the hidden input
            applyFor = $('#applyforListEdit').find(":selected").val();
            comment = $('textarea#commentDocTypeEdit').val();
            $('#docTypeEdit').val('');
            $('#docTypeidEdit').val('');
            $('#editDocType').modal('hide');
            break;
        case 3: // Delete
            docType = 'N/A';
            id = $("#docTypeidDelete").val(); // Get the id from the hidden input
            $('#docTypeidDelete').val('');
            $('#deleteDocType').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudDocType',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "docType": docType, "comment": comment, "applyFor": applyFor, "action": action, "id": id },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('DocType');
                $('#failedMsg').html('DocType failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('DocType');
                $('#successMsg').html('DocType was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=DocTypeList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupDocTypeGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('DocType');
                        $('#failedMsg').html('DocType failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('DocType');
                        $('#failedMsg').html('DocType failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('DocType');
            $('#failedMsg').html('DocType failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('DocType');
            $('#failedMsg').html('DocType failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion
//#endregion

//#region ====== Site =======

//#region Grid...
class SiteButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editSite', 'link-success', 'bi bi-pencil-fill', params.data.siteName, params.data.siteAddress, params.data.siteId,
            params.data.siteContact, params.data.sitePhone, params.data.siteEmail, params.data.siteCode);
        const deleteLink = createActionLink('Delete', '#deleteSite', 'link-danger', 'bi bi-x-octagon-fill', params.data.siteName, params.data.siteAddress, params.data.siteId,
            params.data.siteContact, params.data.sitePhone, params.data.siteEmail, params.data.siteCode );
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
    }

    getGui() {
        return this.eGui;
    }

    // Optional: Implement refresh or destroy methods if needed
    refresh(params) {
        return false; // Return true if the component can refresh, false otherwise
    }

    destroy() {
        // Clean up resources if necessary
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridSiteApi;


// Grid Options: Contains all of the grid configurations
const gridSiteOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "siteId", filter: 'agTextColumnFilter', hide: true },
        { field: "siteName", filter: 'agTextColumnFilter' },
        { field: "siteAddress", filter: 'agTextColumnFilter' },
        { field: "siteContact", filter: 'agTextColumnFilter' },
        { field: "sitePhone", filter: 'agTextColumnFilter' },
        { field: "siteEmail", filter: 'agTextColumnFilter' },
        { field: "siteCode", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: SiteButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,

};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


function getSiteList() {
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SiteList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            console.log(data.data);
            setupSiteGrid(data.data);
        },
        failure: function (response) {
            $('#failedTitle').html('Site');
            $('#failedMsg').html('Site failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Site');
            $('#failedMsg').html('Site failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setupSiteGrid(data) {
    // console.log(data);
    $('#siteGrid').html('');
    gridSiteOptions.rowData = data;
    gridSiteApi = agGrid.createGrid(document.querySelector("#siteGrid"), gridSiteOptions);
    //alert('done');
}
//#endregion

//#region Add Site

function crudSite(action) {
    $('#validateSite').html('');
    $('#validateSiteEdit').html('');
    let siteName = '';
    let siteAddress = '';
    let siteEmail = '';
    let sitePhone = '';
    let siteCode = '';
    let siteContact = '';
    let siteId = 0;
    switch (action) {
        case 1: // Add
            siteName = $("#siteName").val();
            if (siteName === "") {
                $('#validateSite').html('Please enter a site name');
                $('#validateSite').show();
                return;
            } 
            siteAddress = $("#siteAddress").val();
            siteEmail = $("#siteEmail").val();
            sitePhone = $("#sitePhone").val();
            siteCode = $("#siteCode").val();
            siteContact = $("#siteContact").val();

            $("#siteName").val('');
            $("#siteAddress").val('');
            $("#siteEmail").val('');
            $("#sitePhone").val('');
            $("#siteCode").val('');
            $("#siteContact").val('');
            $('#siteNewModal').modal('hide');
            siteId = 0; // New Site, so id is 0
            break;
        case 2: // Edit
            siteName = $("#siteNameEdit").val();
            if (siteName === "") {
                $('#validateSiteEdit').html('Please enter a site');
                $('#validateSiteEdit').show();
                return;
            }
            siteAddress = $("#siteAddressEdit").val();
            siteEmail = $("#siteEmailEdit").val();
            sitePhone = $("#sitePhoneEdit").val();
            siteContact = $("#siteContactEdit").val();
            siteCode = $("#siteCodeEdit").val();
            siteId = $("#siteidEdit").val(); // Get the id from the hidden input

            $('#siteNameEdit').val('');
            $('#siteAddressEdit').val('');
            $('#siteEmailEdit').val('');
            $('#sitePhoneEdit').val('');
            $('#siteContactEdit').val('');
            $("#siteContactEdit").val('');
            $('#siteidEdit').val('');
            $('#editSite').modal('hide');
            break;
        case 3: // Delete
            siteName = 'N/A';
            siteId = $("#siteidDelete").val(); // Get the id from the hidden input
            $('#siteidDelete').val('');
            $('#deleteSite').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudSite',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {
            "siteName": siteName, "siteAddress": siteAddress, "siteContact": siteContact,
            "sitePhone": sitePhone, "siteEmail": siteEmail, "siteCode": siteCode, "action": action, "siteId": siteId
        },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Site');
                $('#failedMsg').html('Site failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Site');
                $('#successMsg').html('Site was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=SiteList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupSiteGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Site');
                        $('#failedMsg').html('Site failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Site');
                        $('#failedMsg').html('Site failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Site');
            $('#failedMsg').html('Site failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Site');
            $('#failedMsg').html('Site failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

//#endregion

//#endregion
