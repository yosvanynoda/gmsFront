//#region Grid...
class MonitorButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editMonitor', 'link-success', 'bi bi-pencil-fill', params.data.id, params.data.firstName, params.data.lastName,
            params.data.email, params.data.phone, params.data.role, params.data.sponsorName, params.data.sponsorId);
        const deleteLink = createActionLink('Delete', '#deleteMonitor', 'link-danger', 'bi bi-x-octagon-fill', params.data.id, params.data.firstName, params.data.lastName, 
            params.data.email, params.data.phone, params.data.role, params.data.sponsorName, params.data.sponsorId);
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
        { field: "firstName", filter: 'agTextColumnFilter' },
        { field: "lastName", filter: 'agTextColumnFilter' },
        { field: "email", filter: 'agTextColumnFilter' },
        { field: "phone", filter: 'agTextColumnFilter' },
        { field: "role", filter: 'agTextColumnFilter' },
        { field: "actionDate", filter: true, hide: true },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
        { field: "sponsorName", filter: 'agTextColumnFilter' },
        { field: "active", filter: true, hide: true },  
        { field: "sponsorId", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: MonitorButtonRenderer,
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
        url: urlIndex + "?handler=MonitorList",
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
    $("#monitorGrid").html('');
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#monitorGrid"), gridOptions);
    //alert('done');
}
//#endregion

//#region general functions create links...
// Helper function to create each action link


function createActionLink(title, href, linkClass, iconClass, id, firstName, lastName, email, phone, role, sponsorName, sponsorId) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;
    a.addEventListener('click', () => {
        if (href == "#editMonitor") {
            $('#monitoridEdit').val(id);
            $('#sponsoridEdit').val(sponsorId);
            $('#firstNameEdit').val(firstName);
            $('#lastNameEdit').val(lastName);
            $('#emailEdit').val(email);
            $('#phoneEdit').val(phone);
            $('#roleEdit').val(role);
            $('#sponsorEdit').val(sponsorName);          
        }
        else {
            $('#monitoridDelete').val(id);
            $('#firstNameD').html(firstName);
            $('#lastNameD').html(lastName);        
            $('#emailD').html(email); 
            $('#phoneD').html(phone);
            $('#roleD').html(role);
            $('#sponsorD').html(sponsorName);
        }
        $(href).modal('show');
    });
    a.appendChild(icon);

    return a;
}

//#endregion

//#region Add Monitor

function crudMonitor(action) {
    $('#validateMonitor').html('');
    let id = 0;
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let role = '';
    let sponsorId = 0;
    switch (action) {
        case 1: // Add
            firstName = $("#firstName").val();
            if (firstName === "") {
                $('#validateFirstName').html('Please enter a monitor FirstName');
                $('#validateFirstName').show();
                return;
            }
            sponsorId = $('#sponsor').find(":selected").val();
            if (sponsorId == -1) {
                $('#validateSponsor').html('Please select a Sponsor');
                $('#validateSponsor').show();
                return;
            }
            lastName = $("#lastName").val();
            if (lastName === "") {
                $('#validateLastName').html('Please enter a monitor LastName');
                $('#validateLastName').show();
                return;
            }
            email = $("#email").val();
            if (email === "") {
                $('#validateEmail').html('Please enter a monitor Email');
                $('#validateEmail').show();
                return;
            }
            phone = $("#phone").val();
            if (phone === "") {
                $('#validatePhone').html('Please enter a monitor Phone');
                $('#validatePhone').show();
                return;
            }
            role = $("#role").val();
            if (role === "") {
                $('#validateRole').html('Please enter a monitor Role');
                $('#validateRole').show();
                return;
            }
            id = 0; // New monitor, so id is 0
            $('#firstName').val('');
            $('#lastName').val('');
            $('#email').val('');
            $('#phone').val('');
            $('#role').val('');
            $('#monitorNewModal').modal('hide');
            break;
        case 2: // Edit
            firstName = $("#firstNameEdit").val();
            if (firstName === "") {
                $('#validateFirstNameEdit').html('Please enter a monitor FirstName');
                $('#validateFirstNameEdit').show();
                return;
            }
            lastName = $("#lastNameEdit").val();
            if (lastName === "") {
                $('#validateLastNameEdit').html('Please enter a monitor LastName');
                $('#validateLastNameEdit').show();
                return;
            }
            id = $("#monitoridEdit").val(); // Get the id from the hidden input
            email = $("#emailEdit").val();
            if (email === "") {
                $('#validateEmailEdit').html('Please enter a monitor Email');
                $('#validateEmailEdit').show();
                return;
            }
            phone = $("#phoneEdit").val();
            if (phone === "") {
                $('#validatePhoneEdit').html('Please enter a monitor Phone');
                $('#validatePhoneEdit').show();
                return;
            }
            role = $("#roleEdit").val();
            if (role === "") {
                $('#validateRoleEdit').html('Please enter a monitor Role');
                $('#validateRoleEdit').show();
                return;
            }
            sponsorId = $("#sponsoridEdit").val();
            $('#firstNameEdit').val('');
            $('#lastNamEdite').val('');
            $('#emailEdit').val('');
            $('#phoneEdit').val('');
            $('#roleEdit').val('');
            $('#sponsoridEdit').val('');
            $('#editMonitor').modal('hide');
            break;
        case 3: // Delete
            firstName = 'N/A';
            lastName = 'N/A';
            email = 'N/A';
            phone = 'N/A';
            role = 'N/A';
            id = $("#monitoridDelete").val(); // Get the id from the hidden input
            $('#monitoridDelete').val('');
            $('#deleteMonitor').modal('hide');
            break;
    }
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudMonitor',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {
            "id": id, "firstName": firstName, "lastName": lastName, "email": email,
            "phone": phone, "role": role, "sponsorId": sponsorId, "action": action
        },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Monitor');
                $('#failedMsg').html('Monitor failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Monitor');
                $('#successMsg').html('Monitor was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + "?handler=MonitorList",
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

function hideAlerts(alertName) {
    $('#' + alertName).hide();
}

//#endregion

//#region General...
function hideAlerts(alertName) {
    $('#' + alertName).hide();
}

$('#monitorNewModal').on('shown.bs.modal', function (e) {
    setupCombo(-1, '#sponsor')
});

function setupCombo(selectedValue, comboName) {
    $.ajax({
        type: "POST",
        url: urlIndexSponsor + '?handler=SponsorDropList',
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
                    $(comboName).append($(`<option value=${item.id} selected="selected">${item.name}</option>`))
                }
                else {
                    $(comboName).append($('<option>', {
                        value: item.id,
                        text: item.name
                    }));
                }

            });
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
//#endregion





