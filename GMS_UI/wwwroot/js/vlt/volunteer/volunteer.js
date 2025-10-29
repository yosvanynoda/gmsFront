//#region Grid...
class VolunteerButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div');
        const editLink = createActionLink('Edit', `/VLT/Volunteer/Edit?volunteerId=${params.data.volunteerId}`, 'link-success', 'bi bi-pencil-fill', params.data.volunteerId);
        const historyLink = createActionLink('History', '#volunteerHistoryModal', 'link-info', 'bi bi-clock-history', params.data.volunteerId,
            params.data.firstName, params.data.lastName);
        const preAssignLink = createActionLink('Pre-Assign', '#preAssignModal', 'link-primary', 'bi bi-person-plus', params.data.volunteerId,
            params.data.firstName, params.data.lastName);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(historyLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(preAssignLink);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }

    destroy() {
        this.eGui.removeEventListener('click', () => { });
    }
}

let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "volunteerId", headerName: "ID", filter: 'agTextColumnFilter', hide: true },
        {
            field: "flagColor",
            headerName: "",
            width: 50,
            cellRenderer: (params) => {
                if (params.value && params.value !== '' && params.value !== '#FFFFFF' && params.value !== 'white') {
                    return `<i class="bi bi-circle-fill" style="color: ${params.value};"></i>`;
                }
                return '';
            },
            sortable: false,
            filter: false
        },
        { field: "firstName", headerName: "First Name", filter: 'agTextColumnFilter' },
        { field: "lastName", headerName: "Last Name", filter: 'agTextColumnFilter' },
        {
            field: "subjectDOB", headerName: "Date of Birth", filter: 'agTextColumnFilter',
            cellRenderer: (data) => {
                return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
        },
        { field: "sex", headerName: "Sex", filter: 'agTextColumnFilter' },
        { field: "race", headerName: "Race", filter: 'agTextColumnFilter' },
        { field: "phone", headerName: "Phone", filter: 'agTextColumnFilter' },
        { field: "ethnicity", headerName: "Ethnicity", filter: 'agTextColumnFilter' },
        { field: "currentStatus", headerName: "Status", filter: 'agTextColumnFilter' },
        { field: "companyId", headerName: "Company", filter: true, hide: true },
        { field: "siteId", headerName: "Site", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: VolunteerButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    pagination: true,
};
//#endregion
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    /*console.log("The DOM is fully loaded!");*/
    // Your code here

    $.ajax({
        type: "POST",
        url: urlIndex,
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {


            setupGrid(data.data);

        },
        failure: function (response) {
            alert('fail');
        },
        error: function (response) {
            alert('fail');
        }
    });
});

function setupGrid(data) {
    console.log('Grid data received:', data);
    if (data && data.length > 0) {
        console.log('First record sample:', data[0]);
    }
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#volunteerGrid"), gridOptions);
}

//#region general functions create links...
// Helper function to create each action link
function createActionLink(title, href, linkClass, iconClass, volunteerId, firstName, lastName) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;

    if (href.startsWith('#')) {
        // For modal links (history, pre-assign)
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (href === "#volunteerHistoryModal") {
                loadVolunteerHistory(volunteerId, firstName, lastName);
            } else if (href === "#preAssignModal") {
                showPreAssignModal(volunteerId, firstName, lastName);
            }
            $(href).modal('show');
        });
    }
    // For direct navigation (edit), just use the href

    a.appendChild(icon);
    return a;
}
//#endregion

//#region Volunteer History...
function loadVolunteerHistory(volunteerId, firstName, lastName) {
    // Set volunteer name in modal
    $('#volunteerHistoryName').text(`${firstName} ${lastName}`);

    // Show loading state
    $('#historyStudiesBody').html('<tr><td colspan="6" class="text-center"><i class="bi bi-hourglass-split"></i> Loading...</td></tr>');
    $('#historySelectionsBody').html('<tr><td colspan="6" class="text-center"><i class="bi bi-hourglass-split"></i> Loading...</td></tr>');

    // Call API
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=GetHistory',
        data: JSON.stringify({ volunteerId: volunteerId, companyId: 1, siteId: 1 }),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken
        },
        success: function (response) {
            console.log('=== HISTORY RESPONSE ===');
            console.log('Full response:', response);
            console.log('response.success:', response.success);
            console.log('response.data:', response.data);
            if (response.data) {
                console.log('Data keys:', Object.keys(response.data));
                console.log('Studies (lowercase):', response.data.studies);
                console.log('Studies (PascalCase):', response.data.Studies);
                console.log('Selections (lowercase):', response.data.selections);
                console.log('Selections (PascalCase):', response.data.Selections);
            }

            if (response.success && response.data) {
                // Handle both camelCase and PascalCase
                const studies = response.data.studies || response.data.Studies || [];
                const selections = response.data.selections || response.data.Selections || [];

                console.log('Studies array length:', studies.length);
                console.log('Selections array length:', selections.length);

                // Display Studies
                if (studies && studies.length > 0) {
                    let studiesHtml = '';
                    studies.forEach(study => {
                        console.log('Study item:', study);
                        studiesHtml += `<tr>
                            <td>${study.volunteername || study.Volunteername || ''}</td>
                            <td>${study.studyName || study.StudyName || ''}</td>
                            <td>${study.startDate || study.StartDate ? new Date(study.startDate || study.StartDate).toLocaleDateString() : ''}</td>
                            <td>${study.endDate || study.EndDate ? new Date(study.endDate || study.EndDate).toLocaleDateString() : ''}</td>
                            <td>${study.randomCode || study.RandomCode || ''}</td>
                            <td>${study.ramdoDate || study.RamdoDate ? new Date(study.ramdoDate || study.RamdoDate).toLocaleDateString() : ''}</td>
                        </tr>`;
                    });
                    $('#historyStudiesBody').html(studiesHtml);
                } else {
                    console.log('No studies found');
                    $('#historyStudiesBody').html('<tr><td colspan="6" class="text-center text-muted">No studies found</td></tr>');
                }

                // Display Selections
                if (selections && selections.length > 0) {
                    let selectionsHtml = '';
                    selections.forEach(selection => {
                        console.log('Selection item:', selection);
                        selectionsHtml += `<tr>
                            <td>${selection.volunteername || selection.Volunteername || ''}</td>
                            <td>${selection.studyName || selection.StudyName || ''}</td>
                            <td>${selection.startDate || selection.StartDate ? new Date(selection.startDate || selection.StartDate).toLocaleDateString() : ''}</td>
                            <td>${selection.endDate || selection.EndDate ? new Date(selection.endDate || selection.EndDate).toLocaleDateString() : ''}</td>
                            <td>${selection.preAssignedDate || selection.PreAssignedDate ? new Date(selection.preAssignedDate || selection.PreAssignedDate).toLocaleDateString() : ''}</td>
                            <td>${selection.notes || selection.Notes || ''}</td>
                        </tr>`;
                    });
                    $('#historySelectionsBody').html(selectionsHtml);
                } else {
                    console.log('No selections found');
                    $('#historySelectionsBody').html('<tr><td colspan="6" class="text-center text-muted">No selections found</td></tr>');
                }
            } else {
                console.error('Response not successful or no data');
                $('#historyStudiesBody').html('<tr><td colspan="6" class="text-center text-danger">Error loading history</td></tr>');
                $('#historySelectionsBody').html('<tr><td colspan="6" class="text-center text-danger">Error loading history</td></tr>');
            }
        },
        error: function (xhr, status, error) {
            console.error('History Error:', error);
            $('#historyStudiesBody').html('<tr><td colspan="6" class="text-center text-danger">Error: ' + error + '</td></tr>');
            $('#historySelectionsBody').html('<tr><td colspan="6" class="text-center text-danger">Error: ' + error + '</td></tr>');
        }
    });
}
//#endregion

//#region Pre-Assign to Study...
function showPreAssignModal(volunteerId, firstName, lastName) {
    console.log('Show pre-assign modal for volunteer:', volunteerId, firstName, lastName);

    // Set volunteer name in modal
    $('#preAssignVolunteerName').text(`${firstName} ${lastName}`);

    // Clear the study dropdown
    $('#preAssignStudyId').val('');

    // Store volunteer ID in hidden field
    $('#preAssignVolunteerId').val(volunteerId);
}

function assignVolunteerToStudy() {
    const volunteerId = $('#preAssignVolunteerId').val();
    const studyId = $('#preAssignStudyId').val();

    console.log('Assign volunteer to study - VolunteerId:', volunteerId, 'StudyId:', studyId);

    if (!volunteerId) {
        alert('Missing volunteer information');
        return;
    }

    if (!studyId) {
        alert('Please select a study');
        $('#preAssignStudyId').focus();
        return;
    }

    let vid = [];

    vid.push(parseInt(volunteerId));

    // Build request - Backend expects PascalCase property names
    const request = {
        StudyId: parseInt(studyId),
        VolunteerId: vid,
    };

    console.log('Pre-Assign Request:', request);

    // Call page handler
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=PreAssign',
        data: { "requestInput": request},
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken
        },
        success: function(response) {
            console.log('Pre-Assign Response:', response);

            if (response.success) {
                alert(`Success! Volunteer pre-assigned to study.`);

                // Close the modal
                $('#preAssignModal').modal('hide');
            } else {
                alert('Error pre-assigning volunteer: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr, status, error) {
            console.error('Pre-Assign Error:', error);
            console.error('XHR Status:', xhr.status);
            console.error('XHR Response:', xhr.responseText);

            let errorMessage = 'Unknown error';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            } else {
                errorMessage = error;
            }

            alert('Error pre-assigning volunteer: ' + errorMessage);
        }
    });
}
//#endregion
