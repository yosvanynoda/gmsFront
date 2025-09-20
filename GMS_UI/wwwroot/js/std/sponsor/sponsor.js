//#region Grid...
class SponsorButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editSponsor', 'link-success', 'bi bi-pencil-fill', params.data.name, params.data.sponsorType, params.data.id, params.data.contactName, params.data.contactEmail, params.data.contactPhone, params.data.type );
        const deleteLink = createActionLink('Delete', '#deleteSponsor', 'link-danger', 'bi bi-x-octagon-fill', params.data.name, params.data.sponsorType, params.data.id, params.data.contactName, params.data.contactEmail, params.data.contactPhone, params.data.type);
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

let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "id", filter: 'agTextColumnFilter', hide: true },
        { field: "name", filter: 'agTextColumnFilter' },
        { field: "type", filter: true, hide: true },
        { field: "sponsorType", filter: true},
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
        { field: "contactName", filter: true },
        { field: "contactEmail", filter: true },
        { field: "contactPhone", filter: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: SponsorButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableAdvancedFilter: true,
    pagination: true,
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    /*console.log("The DOM is fully loaded!");*/
    // Your code here

    $.ajax({
        type: "POST",
        url: urlIndex + "?handler=SponsorList",
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
    $('#sponsorGrid').html(''); // Clear the grid container')
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#sponsorGrid"), gridOptions);
    //alert('done');
}
//#endregion

//#region general functions create links...
// Helper function to create each action link

function createActionLink(title, href, linkClass, iconClass, sponsor, sponsorType, id, contactName, contactEmail, contactPhone, sponsorTypeId) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;
    a.addEventListener('click', () => {
        if (href == "#editSponsor") {
            $('#sponsorNameEdit').val(sponsor);
            $('#sponsoridEdit').val(id);
            $('#contactNameEdit').val(contactName);
            $('#contactEmailEdit').val(contactEmail);
            $('#contactPhoneEdit').val(contactPhone);
            $('#sponsorTypeIdEdit').val(sponsorTypeId);
        }
        else {
            $('#nameD').html(sponsor);
            $('#typeD').html(sponsorType);
            $('#contactNameD').html(contactName);
            $('#contactEmailD').html(contactEmail);
            $('#contactPhoneD').html(contactPhone);
            $('#sponsoridDelete').val(id);
        }
        $(href).modal('show');
    });
    a.appendChild(icon);

    return a;
}

//#endregion

//#region Add Sponsor
function crudSponsor(action) {
    $('#validateSponsor').html('');
    let sponsorName = '';
    let sponsorType = '';
    let contactName = '';
    let contactEmail = '';
    let contactPhone = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            sponsorName = $("#sponsorName").val();
            if (sponsorName === "") {
                $('#validateSponsor').html('Please enter an sponsor');
                $('#validateSponsor').show();
                return;
            }
            sponsorType = $('#sponsorType').find(":selected").val();
            if (sponsorType == -1) {
                $('#validateSponsorType').html('Please select a sponsor type');
                $('#validateSponsorType').show();
                return;
            }
            contactName = $("#contactName").val();
            contactEmail = $("#contactEmail").val();
            contactPhone = $("#contactPhone").val();

            id = 0; // New gender, so id is 0
            $('#sponsorName').val('');

            $('#siteId').val('');
            $('#sponsorNewModal').modal('hide');
            break;
        case 2: // Edit
            sponsorName = $("#sponsorNameEdit").val();
            if (sponsorName === "") {
                $('#validateSponsorEdit').html('Please enter an sponsor');
                $('#validateSponsorEdit').show();
                return;
            }
            sponsorType = $('#sponsorTypeEdit').find(":selected").val();
            if (sponsorType == -1) {
                $('#validateSponsorTypeEdit').html('Please select a task type');
                $('#validateSponsorTypeEdit').show();
                return;
            }
            contactName = $("#contactNameEdit").val();
            contactEmail = $("#contactEmailEdit").val();
            contactPhone = $("#contactPhoneEdit").val();

            id = $('#sponsoridEdit').val();

            $('#sponsorNameEdit').val('');
            $('#editSponsor').modal('hide');
            break; sponsorName = $("#sponsorName").val();
            if (sponsorName === "") {
                $('#validateSponsor').html('Please enter an sponsor');
                $('#validateSponsor').show();
                return;
            }
            sponsorType = $('#sponsorType').find(":selected").val();
            if (sponsorType == -1) {
                $('#validateSponsorType').html('Please select a task type');
                $('#validateSponsorType').show();
                return;
            }
            contactName = $("#contactName").val();
            contactEmail = $("#contactEmail").val();
            contactPhone = $("#contactPhone").val();

            id = 0; // New gender, so id is 0
            $('#sponsorName').val('');

            $('#siteId').val('');
            $('#sponsorNewModal').modal('hide');
            break;
            break;
        case 3: // Delete
            sponsorName = 'N/A';
            id = $("#sponsoridDelete").val(); // Get the id from the hidden input
            $('#sponsoridDelete').val('');
            $('#deleteSponsor').modal('hide');
            break;
    }



    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudSponsor',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "id": id, "action": action, "name": sponsorName, "sponsorType": sponsorType, "contactName": contactName, "contactEmail": contactEmail, "contactPhone": contactPhone },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Sponsor');
                $('#failedMsg').html('Sponsor failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Sponsor');
                $('#successMsg').html('Sponsor was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + "?handler=SponsorList",
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    },
                    failure: function (response) {

                    },
                    error: function (response) {

                    }
                });

            }
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

function hideAlerts(alertName) {
    $('#' + alertName).hide();
}

//#endregion

//#region General...
function hideAlerts(alertName) {
    $('#' + alertName).hide();
}
//#endregion


$('#sponsorNewModal').on('shown.bs.modal', function (e) {
    setupCombo(-1, '#sponsorType')
});

$('#editSponsor').on('shown.bs.modal', function (e) {
    let ttid = $('#sponsorTypeIdEdit').val();
    setupCombo(ttid, '#sponsorTypeEdit');
});


function setupCombo(selectedValue, comboName) {
    $.ajax({
        type: "POST",
        url: urlIndexCMN + '?handler=SponsorTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)
            $(comboName).empty();

            if (selectedValue == -1) {
                $(comboName).append($(`<option value=-1 selected="selected">Please select an option</option>`))
            }


            // Loop through data and append options
            $.each(data.data, function (index, item) {
                if (item.id == selectedValue) {
                    $(comboName).append($(`<option value=${item.id} selected="selected">${item.sponsorType}</option>`))
                }
                else {
                    $(comboName).append($('<option>', {
                        value: item.id,
                        text: item.sponsorType
                    }));
                }

            });
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor Type');
            $('#failedMsg').html('Sponsor Type failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor Type');
            $('#failedMsg').html('Sponsor Type failed. Please try again');
            $('#failedAlert').show();
        }
    });
}





