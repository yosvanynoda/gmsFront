//#region Grid...
class StudioListButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', `${urlIndex}/edit?id=${params.data.id}`, 'link-success', 'bi bi-pencil-fill', params.data.id, params.data.studioList, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes, false);
        const staffManagementLink = createActionLink('Staff', '#staffManagementModal', 'link-info', 'bi bi-people-fill', params.data.id, params.data.name, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes, true);
        const deleteLink = createActionLink('Delete', '#deleteStudioList', 'link-danger', 'bi bi-x-octagon-fill', params.data.id, params.data.studioList, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes, true);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(staffManagementLink);
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
        { field: "sponsorName", filter: 'agTextColumnFilter' },
        { field: "code", headerName: "Site Number", filter: 'agTextColumnFilter' },
        { field: "name", filter: 'agTextColumnFilter' },
        { field: "description", filter: 'agTextColumnFilter' },
        { field: "protocolName", filter: 'agTextColumnFilter' },
        { field: "studioStatusName", filter: 'agTextColumnFilter' },
        { field: "team", headerName: "Team", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "goal", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: StudioListButtonRenderer,
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

    console.log('loading studioList data...');

    $.ajax({
        type: "POST",
        url: urlIndex + "?handler=StudioList",
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            console.log(data.data);
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
    console.log(data);
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#studioListGrid"), gridOptions);
    //alert('done');
}
//#endregion

//#region general functions create links...
// Helper function to create each action link

function createActionLink(title, href, linkClass, iconClass, id, studioList, datecreated, version, siteId, notes, isModal = false) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;

    if (isModal) {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (href == "#editStudioList") {
                $('#studioListEdit').val(studioList);
                $('#versionEdit').val(version);
                $('#studioListidEdit').val(id);
                $('#datecreatedEdit').val(datecreated);
                $('#notesEdit').val(notes);
                $('#siteIdEdit').val(siteId);
            }
            else if (href == "#deleteStudioList") {
                $('#studioListD').html(studioList);
                $('#versionD').html(version);
                $('#siteIdD').html(siteId);
                $('#studioListidDelete').val(id);
            }
            else if (href == "#staffManagementModal") {
                $('#currentStudioId').val(id);
                $('#studioNameHeader').text(studioList);
                resetStaffAssignmentForm();
                loadStaffForStudioDropdown();
                loadStaffForStudioAssignments(id);
            }

            if (href.startsWith('#')) {
                $(href).modal('show');
            }
        });
    }

    a.appendChild(icon);

    return a;
}

//#endregion

//#region Add StudioList

function crudStudioList(action) {
    $('#validateStudioList').html('');
    let studioList = '';
    let version = '';
    let email = '';
    let phone = '';
    let role = '';
    let id = 0;
    let siteId = 0;
    switch (action) {
        case 1: // Add
            studioList = $("#studioList").val();
            if (studioList === "") {
                $('#validateStudioList').html('Please enter an studioList');
                $('#validateStudioList').show();
                return;
            }

            version = $("#version").val();
            email = $("#email").val();
            phone = $("#phone").val();
            role = $("#role").val();
            siteId = $("#siteId").val();
            id = 0; // New gender, so id is 0
            $('#studioList').val('');
            $('#version').val('');
            $('#email').val('');
            $('#phone').val('');
            $('#role').val('');
            $('#siteId').val('');
            $('#studioListNewModal').modal('hide');
            break;
        case 2: // Edit
            studioList = $("#studioListEdit").val();
            if (studioList === "") {
                $('#validateStudioList').html('Please enter an studioList');
                $('#validateStudioList').show();
                return;
            }
            version = $("#versionEdit").val();
            id = $("#studioListidEdit").val(); // Get the id from the hidden input
            email = $("#emailEdit").val();
            phone = $("#phoneEdit").val();
            role = $("#roleEdit").val();
            siteId = $("#siteIdEdit").val();
            $('#studioListEdit').val('');
            $('#lastNamEdite').val('');
            $('#emailEdit').val('');
            $('#phoneEdit').val('');
            $('#siteIdEdit').val('');
            $('#editStudioList').modal('hide');
            break;
        case 3: // Delete
            studioList = 'N/A';
            id = $("#studioListidDelete").val(); // Get the id from the hidden input
            $('#studioListidDelete').val('');
            $('#deleteStudioList').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudStudioList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "id": id, "studioList": studioList, "version": version, "siteId": siteId },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('StudioList');
                $('#failedMsg').html('StudioList failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('StudioList');
                $('#successMsg').html('StudioList was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex,
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        $('#studioListGrid').html('');
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
            $('#failedTitle').html('StudioList');
            $('#failedMsg').html('StudioList failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('StudioList');
            $('#failedMsg').html('StudioList failed. Please try again');
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

//#region Helper Functions
function setCombos(comboName, values, firstElement) {
    // Empty combo
    $(comboName).empty();

    // Set first element
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

//#region Staff Management for Studio

let staffForStudioGridApi;

// Load staff dropdown for studio
function loadStaffForStudioDropdown() {
    console.log('Loading staff dropdown for studio...');
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=StaffDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "companyId": 1, "siteId": 1 },
        success: function (data) {
            console.log('Staff dropdown response:', data);
            if (data.success && data.data) {
                setCombos('#staffSelectForStudio', data.data, 'Staff');
            } else {
                console.error('Failed to load staff dropdown:', data.errorMessage);
            }
        },
        error: function (response) {
            console.error('Error loading staff dropdown:', response);
        }
    });
}

// Load staff assignments for studio
function loadStaffForStudioAssignments(studioId) {
    console.log('Loading staff assignments for studio:', studioId);
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=StudioStaffAssignments',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "studioId": studioId },
        success: function (response) {
            console.log('Staff assignments response:', response);
            console.log('Response data:', response.data);
            if (response.data && response.data.length > 0) {
                console.log('First assignment:', response.data[0]);
                console.log('Properties:', Object.keys(response.data[0]));
            }
            if (response.success && response.data) {
                setupStaffForStudioGrid(response.data);
            } else {
                setupStaffForStudioGrid([]);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading assignments:', status, error);
            setupStaffForStudioGrid([]);
        }
    });
}

// Setup AG Grid for staff assignments
function setupStaffForStudioGrid(data) {
    $('#staffForStudioGrid').html('');

    const gridOptions = {
        rowData: data,
        columnDefs: [
            { field: "studioId", hide: true },
            { field: "staffId", hide: true },
            { field: "id", hide: true },
            {
                field: "staffName",
                headerName: "Staff Member",
                flex: 2,
                filter: 'agTextColumnFilter',
                valueGetter: params => {
                    const firstName = params.data.FirstName || params.data.firstName || '';
                    const lastName = params.data.LastName || params.data.lastName || '';
                    return `${firstName} ${lastName}`.trim();
                }
            },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => {
                    if (!params.value || params.value === null) return '';
                    const dateStr = String(params.value);
                    if (dateStr.startsWith('0001-01-01') || dateStr.startsWith('1/1/0001')) return '';
                    try {
                        const date = new Date(params.value);
                        if (isNaN(date.getTime()) || date.getFullYear() < 1900) return '';
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
                    const dateStr = String(params.value);
                    if (dateStr.startsWith('0001-01-01') || dateStr.startsWith('1/1/0001')) return 'Ongoing';
                    try {
                        const date = new Date(params.value);
                        if (isNaN(date.getTime()) || date.getFullYear() < 1900) return 'Ongoing';
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
                        editStaffForStudioAssignment(params.data);
                    };

                    const deleteLink = document.createElement('a');
                    deleteLink.href = '#';
                    deleteLink.className = 'link-danger ms-2';
                    deleteLink.title = 'Delete';
                    deleteLink.innerHTML = '<i class="bi bi-trash-fill"></i>';
                    deleteLink.onclick = (e) => {
                        e.preventDefault();
                        deleteStaffForStudioAssignment(params.data);
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

    staffForStudioGridApi = agGrid.createGrid(document.querySelector("#staffForStudioGrid"), gridOptions);
}

// Save staff assignment
function saveStaffForStudioAssignment() {
    console.log('Saving staff assignment...');

    // Clear validation
    $('#validateStaffForStudio').html('');
    $('#validateStaffStartDate').html('');

    const staffId = $('#staffSelectForStudio').val();
    const startDate = $('#staffStartDate').val();
    const endDate = $('#staffEndDate').val();
    const studioId = $('#currentStudioId').val();
    const action = parseInt($('#staffAssignmentAction').val());

    // Validation
    let isValid = true;

    if (!staffId) {
        $('#validateStaffForStudio').html('Please select a staff member');
        isValid = false;
    }

    if (!startDate) {
        $('#validateStaffStartDate').html('Please select a start date');
        isValid = false;
    }

    if (!isValid) return;

    const requestData = {
        StudioId: parseInt(studioId),
        StaffId: parseInt(staffId),
        RoleId: 0, // No role for now
        StartDate: startDate,
        EndDate: endDate || null,
        CompanyId: 1,
        SiteId: 1,
        UserName: 1,
        Action: action
    };

    console.log('Request data:', requestData);

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SaveStaffForStudioAssignment',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: requestData,
        success: function (response) {
            if (response.success) {
                $('#successTitle').html('Staff Assignment');
                $('#successMsg').html('Staff assignment saved successfully');
                $('#successAlert').show();

                // Reset form and reload grid
                resetStaffAssignmentForm();
                loadStaffForStudioAssignments(studioId);

                // Refresh main studio grid
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=StudioList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    }
                });
            } else {
                $('#failedTitle').html('Staff Assignment');
                $('#failedMsg').html(response.message || 'Failed to save assignment');
                $('#failedAlert').show();
            }
        },
        error: function (error) {
            console.error('Error saving assignment:', error);
            $('#failedTitle').html('Staff Assignment');
            $('#failedMsg').html('Error saving assignment. Please try again.');
            $('#failedAlert').show();
        }
    });
}

// Edit staff assignment
function editStaffForStudioAssignment(data) {
    console.log('Editing assignment:', data);
    $('#staffAssignmentFormTitle').text('Edit Staff Assignment');
    $('#staffAssignmentAction').val('2');
    $('#staffSelectForStudio').val(data.staffId || data.StaffId);

    // Handle dates
    let startDateValue = '';
    let endDateValue = '';

    if (data.startDate || data.StartDate) {
        const dateStr = String(data.startDate || data.StartDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(dateStr);
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

    if (data.endDate || data.EndDate) {
        const dateStr = String(data.endDate || data.EndDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(dateStr);
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

    $('#staffStartDate').val(startDateValue);
    $('#staffEndDate').val(endDateValue);
}

// Delete staff assignment
function deleteStaffForStudioAssignment(data) {
    const firstName = data.FirstName || data.firstName || '';
    const lastName = data.LastName || data.lastName || '';
    const staffName = `${firstName} ${lastName}`.trim();

    if (!confirm(`Are you sure you want to remove "${staffName}" from this study?`)) {
        return;
    }

    const studioId = $('#currentStudioId').val();

    // Convert dates
    let startDate = null;
    let endDate = null;

    if (data.startDate || data.StartDate) {
        const dateStr = String(data.startDate || data.StartDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1753) {
                    startDate = date.toISOString();
                }
            } catch (e) {
                console.error('Error parsing startDate:', e);
            }
        }
    }

    if (data.endDate || data.EndDate) {
        const dateStr = String(data.endDate || data.EndDate);
        if (!dateStr.startsWith('0001-01-01') && !dateStr.startsWith('1/1/0001')) {
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime()) && date.getFullYear() >= 1753) {
                    endDate = date.toISOString();
                }
            } catch (e) {
                console.error('Error parsing endDate:', e);
            }
        }
    }

    const requestData = {
        StudioId: parseInt(studioId),
        StaffId: data.staffId || data.StaffId,
        RoleId: 0,
        CompanyId: 1,
        SiteId: 1,
        UserName: 1,
        Action: 3
    };

    if (startDate !== null) {
        requestData.StartDate = startDate;
    }
    if (endDate !== null) {
        requestData.EndDate = endDate;
    }

    console.log('Delete request data:', requestData);

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=SaveStaffForStudioAssignment',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: requestData,
        success: function (response) {
            if (response.success) {
                $('#successTitle').html('Staff Assignment');
                $('#successMsg').html('Staff assignment removed successfully');
                $('#successAlert').show();

                // Reload grid
                loadStaffForStudioAssignments(studioId);

                // Refresh main studio grid
                $.ajax({
                    type: "POST",
                    url: urlIndex + '?handler=StudioList',
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        setupGrid(data.data);
                    }
                });
            } else {
                $('#failedTitle').html('Staff Assignment');
                $('#failedMsg').html(response.message || 'Failed to remove assignment');
                $('#failedAlert').show();
            }
        },
        error: function (error) {
            console.error('Error removing assignment:', error);
            $('#failedTitle').html('Staff Assignment');
            $('#failedMsg').html('Error removing assignment. Please try again.');
            $('#failedAlert').show();
        }
    });
}

// Reset assignment form
function resetStaffAssignmentForm() {
    $('#staffAssignmentFormTitle').text('Add Staff Assignment');
    $('#staffAssignmentAction').val('1');
    $('#staffSelectForStudio').val('');
    $('#staffStartDate').val('');
    $('#staffEndDate').val('');
    $('#validateStaffForStudio').html('');
    $('#validateStaffStartDate').html('');
}

//#endregion


































