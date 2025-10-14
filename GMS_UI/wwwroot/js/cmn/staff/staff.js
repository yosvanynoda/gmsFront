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

        if (href == "#studiostaff") {
            $('#currentStaffId').val(staffId);
            $('#staffNameHeader').text(firstName + ' ' + lastName);
            resetAssignmentForm();
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

//#region Studio-Staff Assignment Management

let studioStaffGridApi;
let currentStaffForStudioAssignment = null;
let studioDropdownData = [];
let roleDropdownData = [];

// Action link creator already includes studio link - just need to handle the click event
// The createActionLink function at line 63 already creates the studio link

// Initialize Studio-Staff modal when it opens
$(document).on('show.bs.modal', '#studiostaff', function (e) {
    const staffId = $('#currentStaffId').val();
    const staffName = $('#staffNameHeader').text();

    console.log('Modal opening - StaffId:', staffId, 'StaffName:', staffName);

    if (staffId) {
        console.log('Loading dropdowns and assignments...');
        loadStudioDropdown();
        loadRoleDropdown();
        loadStudioStaffAssignments(staffId);
    } else {
        console.error('No staffId found!');
    }
});

// Load Studio dropdown
function loadStudioDropdown() {
    console.log('loadStudioDropdown - calling API...');
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=StudioDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { companyId: 1, siteId: 1 },
        success: function (data) {
            console.log('Studio dropdown SUCCESS - Full response:', data);
            console.log('data.success:', data.success);
            console.log('data.data:', data.data);
            console.log('data.errorMessage:', data.errorMessage);

            if (data.success && data.data) {
                studioDropdownData = data.data;
                const select = $('#studioSelect');
                select.empty();
                select.append('<option value="">Select Studio</option>');
                $.each(data.data, function (index, item) {
                    console.log('Adding studio:', item);
                    select.append($('<option>', {
                        value: item.id,
                        text: item.name
                    }));
                });
                console.log('Studios loaded successfully:', data.data.length);
            } else {
                console.error('Success returned false or no data:', data);
            }
        },
        failure: function (response) {
            console.error('Studio dropdown FAILURE:', response);
            $('#failedTitle').html('Studio Dropdown');
            $('#failedMsg').html('Failed to load studios. Please try again');
            $('#failedAlert').show();
        },
        error: function (xhr, status, error) {
            console.error('Studio dropdown ERROR:', status, error);
            console.error('XHR:', xhr);
            $('#failedTitle').html('Studio Dropdown');
            $('#failedMsg').html('Failed to load studios. Please try again');
            $('#failedAlert').show();
        }
    });
}

// Load Role dropdown
function loadRoleDropdown() {
    console.log('loadRoleDropdown called');
    console.log('URL:', urlIndex + '?handler=RoleTypeList');

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=RoleTypeList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { companyId: 1 },
        success: function (response) {
            console.log('Role dropdown response:', response);
            if (response.success && response.data) {
                roleDropdownData = response.data;
                const select = $('#roleSelect');
                select.empty();
                select.append('<option value="">Select Role</option>');
                response.data.forEach(role => {
                    select.append(`<option value="${role.value}">${role.text}</option>`);
                });
                console.log('Roles loaded:', response.data.length);
            } else {
                console.error('Role dropdown failed:', response);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading roles - Status:', status);
            console.error('Error:', error);
            console.error('Response:', xhr.responseText);
        }
    });
}

// Load current studio-staff assignments
function loadStudioStaffAssignments(staffId) {
    console.log('loadStudioStaffAssignments - staffId:', staffId);
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=StaffStudioAssignments',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { staffId: staffId },
        success: function (response) {
            console.log('Staff assignments response:', response);
            console.log('response.success:', response.success);
            console.log('response.data:', response.data);
            console.log('response.message:', response.message);

            if (response.success && response.data) {
                console.log('Loading grid with', response.data.length, 'assignments');
                setupStudioStaffGrid(response.data);
            } else {
                console.warn('No assignments found or success=false');
                setupStudioStaffGrid([]);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading assignments - Status:', status);
            console.error('Error:', error);
            console.error('XHR:', xhr);
            setupStudioStaffGrid([]);
        }
    });
}

// Setup AG Grid for studio-staff assignments
function setupStudioStaffGrid(data) {
    $('#studioStaffGrid').html('');

    const gridOptions = {
        rowData: data,
        columnDefs: [
            { field: "studioId", hide: true },
            { field: "staffId", hide: true },
            { field: "studioName", headerName: "Studio", flex: 2, filter: 'agTextColumnFilter' },
            { field: "roleName", headerName: "Role", flex: 1, filter: 'agTextColumnFilter' },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => {
                    if (!params.value || params.value === null) return '';

                    // Check if it's a default/min date
                    const dateStr = String(params.value);
                    if (dateStr.startsWith('0001-01-01') || dateStr.startsWith('1/1/0001')) {
                        return '';
                    }

                    try {
                        const date = new Date(params.value);
                        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
                            return '';
                        }
                        return date.toLocaleDateString();
                    } catch (e) {
                        return '';
                    }
                }
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => {
                    if (!params.value || params.value === null) return 'Ongoing';

                    // Check if it's a default/min date
                    const dateStr = String(params.value);
                    if (dateStr.startsWith('0001-01-01') || dateStr.startsWith('1/1/0001')) {
                        return 'Ongoing';
                    }

                    try {
                        const date = new Date(params.value);
                        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
                            return 'Ongoing';
                        }
                        return date.toLocaleDateString();
                    } catch (e) {
                        return 'Ongoing';
                    }
                }
            },
            {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                cellRenderer: params => {
                    const div = document.createElement('div');

                    const editLink = document.createElement('a');
                    editLink.href = '#';
                    editLink.className = 'link-success';
                    editLink.title = 'Edit';
                    editLink.innerHTML = '<i class="bi bi-pencil-fill"></i>';
                    editLink.onclick = (e) => {
                        e.preventDefault();
                        editStudioStaffAssignment(params.data);
                    };

                    const deleteLink = document.createElement('a');
                    deleteLink.href = '#';
                    deleteLink.className = 'link-danger ms-2';
                    deleteLink.title = 'Delete';
                    deleteLink.innerHTML = '<i class="bi bi-trash-fill"></i>';
                    deleteLink.onclick = (e) => {
                        e.preventDefault();
                        deleteStudioStaffAssignment(params.data);
                    };

                    div.appendChild(editLink);
                    div.appendChild(deleteLink);

                    return div;
                }
            }
        ],
        defaultColDef: {
            flex: 1,
            resizable: true
        },
        domLayout: 'autoHeight'
    };

    studioStaffGridApi = agGrid.createGrid(document.querySelector("#studioStaffGrid"), gridOptions);
}

// Save studio-staff assignment (Add or Edit)
function saveStudioStaffAssignment() {
    console.log('saveStudioStaffAssignment called');

    // Clear validation messages
    $('#validateStudio').html('');
    $('#validateRole').html('');
    $('#validateStartDate').html('');

    const studioId = $('#studioSelect').val();
    const roleId = $('#roleSelect').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const staffId = $('#currentStaffId').val();
    const action = parseInt($('#assignmentAction').val());

    console.log('Save data:', { studioId, roleId, startDate, endDate, staffId, action });

    // Validation
    let isValid = true;

    if (!studioId) {
        $('#validateStudio').html('Please select a studio');
        isValid = false;
    }

    if (!roleId) {
        $('#validateRole').html('Please select a role');
        isValid = false;
    }

    if (!startDate) {
        $('#validateStartDate').html('Please select a start date');
        isValid = false;
    }

    if (!isValid) return;

    const requestData = {
        StudioId: parseInt(studioId),
        StaffId: parseInt(staffId),
        RoleId: parseInt(roleId),
        StartDate: startDate,
        EndDate: endDate || null,
        CompanyId: 1,
        SiteId: 1,
        UserName: 1,
        Action: action
    };

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SaveStudioStaffAssignment',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: requestData,
        success: function (response) {
            if (response.success) {
                $('#successTitle').html('Studio Assignment');
                $('#successMsg').html('Studio assignment saved successfully');
                $('#successAlert').show();

                // Reset form
                resetAssignmentForm();

                // Reload assignments grid
                loadStudioStaffAssignments(staffId);

                // Reload main staff grid to update studios column
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=StaffList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    }
                });
            } else {
                $('#failedTitle').html('Studio Assignment');
                $('#failedMsg').html(response.message || 'Failed to save assignment');
                $('#failedAlert').show();
            }
        },
        error: function (error) {
            $('#failedTitle').html('Studio Assignment');
            $('#failedMsg').html('Error saving assignment. Please try again.');
            $('#failedAlert').show();
        }
    });
}

// Edit studio-staff assignment
function editStudioStaffAssignment(data) {
    console.log('editStudioStaffAssignment called with data:', data);
    $('#assignmentFormTitle').text('Edit Studio Assignment');
    $('#assignmentAction').val('2');
    $('#studioSelect').val(data.studioId);
    $('#roleSelect').val(data.roleId);

    // Handle date formatting - convert to YYYY-MM-DD for input[type="date"]
    let startDateValue = '';
    let endDateValue = '';

    if (data.startDate) {
        const dateStr = String(data.startDate);
        // Skip default/min dates
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(data.startDate);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1900) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    startDateValue = `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.error('Error parsing startDate:', e);
            }
        }
    }

    if (data.endDate) {
        const dateStr = String(data.endDate);
        // Skip default/min dates
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(data.endDate);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1900) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    endDateValue = `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.error('Error parsing endDate:', e);
            }
        }
    }

    $('#startDate').val(startDateValue);
    $('#endDate').val(endDateValue);

    console.log('Form populated - Studio:', data.studioId, 'Role:', data.roleId, 'StartDate:', startDateValue, 'EndDate:', endDateValue);
}

// Delete studio-staff assignment
function deleteStudioStaffAssignment(data) {
    console.log('deleteStudioStaffAssignment called with data:', data);

    if (!confirm(`Are you sure you want to remove the assignment to "${data.studioName}"?`)) {
        return;
    }

    const staffId = $('#currentStaffId').val();
    console.log('Deleting assignment for staffId:', staffId);

    // Convert dates to valid format or null
    let startDate = null;
    let endDate = null;

    if (data.startDate) {
        const dateStr = String(data.startDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(data.startDate);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1753) {
                    startDate = date.toISOString();
                }
            } catch (e) {
                console.error('Error parsing startDate for delete:', e);
            }
        }
    }

    if (data.endDate) {
        const dateStr = String(data.endDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(data.endDate);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1753) {
                    endDate = date.toISOString();
                }
            } catch (e) {
                console.error('Error parsing endDate for delete:', e);
            }
        }
    }

    const requestData = {
        StudioId: data.studioId,
        StaffId: parseInt(staffId),
        RoleId: data.roleId,
        CompanyId: 1,
        SiteId: 1,
        UserName: 1,
        Action: 3
    };

    // Only add dates if they are valid
    if (startDate !== null) {
        requestData.StartDate = startDate;
    }
    if (endDate !== null) {
        requestData.EndDate = endDate;
    }

    console.log('Delete request data:', requestData);

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SaveStudioStaffAssignment',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: requestData,
        success: function (response) {
            if (response.success) {
                $('#successTitle').html('Studio Assignment');
                $('#successMsg').html('Studio assignment removed successfully');
                $('#successAlert').show();

                // Reload assignments grid
                loadStudioStaffAssignments(staffId);

                // Reload main staff grid to update studios column
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=StaffList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    }
                });
            } else {
                $('#failedTitle').html('Studio Assignment');
                $('#failedMsg').html(response.message || 'Failed to remove assignment');
                $('#failedAlert').show();
            }
        },
        error: function (error) {
            $('#failedTitle').html('Studio Assignment');
            $('#failedMsg').html('Error removing assignment. Please try again.');
            $('#failedAlert').show();
        }
    });
}

// Reset assignment form
function resetAssignmentForm() {
    $('#assignmentFormTitle').text('Add Studio Assignment');
    $('#assignmentAction').val('1');
    $('#studioSelect').val('');
    $('#roleSelect').val('');
    $('#startDate').val('');
    $('#endDate').val('');
    $('#validateStudio').html('');
    $('#validateRole').html('');
    $('#validateStartDate').html('');
}

//#endregion