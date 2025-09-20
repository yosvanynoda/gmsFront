let gridApi;

function createActionLink(title, href, linkClass, iconClass, staffId, firstName, lastName, email, phoneNumber, position, department, staffStatus) {

    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;

    a.addEventListener('click', () => {

        if (href == "#editstaff") {
            $('#firstNameEdit').val(firstName);
            $('#lastNameEdit').val(lastName);
            $('#emailEdit').val(email);
            $('#phoneEdit').val(phoneNumber);
            $('#positionEdit').val(position);
            $('#departmentEdit').val(department);
            $('#statusEdit').val(staffStatus);

            $('#staffIdEdit').val(staffId);
        }

        if (href == "#deletestaff") {
            $('#firstNameD').html(firstName);
            $('#lastNameD').html(lastName);
            $('#emailD').html(email);
            $('#phoneD').html(phoneNumber);
            $('#positionD').html(position);
            $('#departmentD').html(department);
            $('#statusD').html(staffStatus);

            $('#staffIdDelete').val(staffId);
        }

        $(href).modal('show');
    });

    a.appendChild(icon);

    return a;

}

function hideAlerts(alertName) {
    $('#' + alertName).hide();
}

class ButtonCellRenderer {
    init(params) {
        this.eGui = document.createElement('div')

        const editLink = createActionLink('Edit', '#editstaff', 'link-success', 'bi bi-pencil-fill', params.data.staffId, params.data.firstName,
            params.data.lastName, params.data.email, params.data.phoneNumber, params.data.position, params.data.department, params.data.staffStatus);

        const deleteLink = createActionLink('Delete', '#deletestaff', 'link-danger', 'bi bi-x-octagon-fill', params.data.staffId, params.data.firstName,
            params.data.lastName, params.data.email, params.data.phoneNumber, params.data.position, params.data.department, params.data.staffStatus);

        const studioLink = createActionLink('Studio', '#studiostaff', 'link-primary', 'bi bi-book', params.data.staffId, params.data.firstName,
            params.data.lastName, params.data.email, params.data.phoneNumber, params.data.position, params.data.department, params.data.staffStatus);

        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
        this.eGui.appendChild(document.createTextNode(' | '));

        this.eGui.appendChild(studioLink);
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

// Grid Options: Contains all of the grid configurations
const gridOptions = {
    // Data to be displayed
    rowData: [],

    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        { field: "staffId", filter: 'agTextColumnFilter', hide: true },
        { field: "companyId", filter: true, hide: true },
        { field: "firstName", filter: 'agTextColumnFilter' },
        { field: "lastName", filter: 'agTextColumnFilter' },
        { field: "email", filter: 'agTextColumnFilter' },
        { field: "phoneNumber", filter: 'agTextColumnFilter' },
        { field: "position", filter: 'agTextColumnFilter' },
        { field: "department", filter: 'agTextColumnFilter' },
        { field: "staffStatus", filter: 'agTextColumnFilter' },
        { field: "siteId", filter: true, hide: true },
        { field: "actionDateTime", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        { field: "siteName", filter: 'agTextColumnFilter' },
        {
            field: "studios",
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => {
                if (!params.value) return '';
                return params.value
                    .split(',')
                    .map(item => item.trim())
                    .join('<br>');
            },
            cellClass: 'multiline-cell'
        },
        { field: "userName", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: ButtonCellRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    enableFilter: true,
    pagination: true,
    //components: {
    //    staffButtonRenderer: StaffButtonRenderer,
    //}
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    /*console.log("The DOM is fully loaded!");*/
    // Your code here

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=StaffList',
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
    $('#staffGrid').html('');
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#staffGrid"), gridOptions);
}


//#region Add Staff

function crudStaff(action) {
    $('#validateFirstName').html('');
    $('#validateLastName').html('');
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let position = '';
    let department = '';
    let status = '';
    let id = 0;
    switch (action) {
        case 1: // Add
            firstName = $("#firstName").val();
            if (firstName === "") {
                $('#validateFirstName').html('Please enter a First Name');
                $('#validateFirstName').show();
                return;
            }

            lastName = $("#lastName").val();
            if (lastName === "") {
                $('#validateLastName').html('Please enter a Last Name');
                $('#validateLastName').show();
                return;
            }

            email = $("#email").val();
            phone = $("#phone").val();
            position = $("#position").val();
            department = $("#department").val();
            status = $("#status").val();

            id = 0; // New staff, so id is 0

            $('#firstName').val('');
            $('#lastName').val('');
            $("#email").val('');
            $("#phone").val('');
            $("#position").val('');
            $("#department").val('');
            $("#status").val('');
            $('#staffNewModal').modal('hide');

            break;
        case 2: // Edit
            firstName = $("#firstNameEdit").val();
            if (firstName === "") {
                $('#validateFirstNameEdit').html('Please enter a First Name');
                $('#validateFirstNameEdit').show();
                return;
            }

            lastName = $("#lastNameEdit").val();
            if (lastName === "") {
                $('#validateLastNameEdit').html('Please enter a Last Name');
                $('#validateLastNameEdit').show();
                return;
            }

            email = $("#emailEdit").val();
            phone = $("#phoneEdit").val();
            position = $("#positionEdit").val();
            department = $("#departmentEdit").val();
            status = $("#statusEdit").val();

            id = $("#staffIdEdit").val();; // New staff, so id is 0

            $('#firstNameEdit').val('');
            $('#lastNameEdit').val('');
            $("#emailEdit").val('');
            $("#phoneEdit").val('');
            $("#positionEdit").val('');
            $("#departmentEdit").val('');
            $("#statusEdit").val('');
            $('#editstaff').modal('hide');
            break;
        case 3: // Delete
            firstName = 'N/A';
            lastName = 'N/A';
            id = $("#staffIdDelete").val(); // Get the id from the hidden input
            $('#staffIdDelete').val('');
            $('#deletestaff').modal('hide');
            break;
    }


    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudStaff',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: {
            "firstName": firstName, "lastName": lastName, "email": email, "phone": phone,
            "position": position, "department": department, "status": status, "action": action, "id": id
        },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Staff');
                $('#failedMsg').html('Staff failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Staff');
                $('#successMsg').html('Staff was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=StaffList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    },
                    failure: function (response) {
                        $('#failedTitle').html('Staff');
                        $('#failedMsg').html('Staff failed. Please try again');
                        $('#failedAlert').show();
                    },
                    error: function (response) {
                        $('#failedTitle').html('Staff');
                        $('#failedMsg').html('Staff failed. Please try again');
                        $('#failedAlert').show();
                    }
                });

            }
        },
        failure: function (response) {
            $('#failedTitle').html('Staff');
            $('#failedMsg').html('Staff failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Staff');
            $('#failedMsg').html('Staff failed. Please try again');
            $('#failedAlert').show();
        }
    });
}
//#endregion