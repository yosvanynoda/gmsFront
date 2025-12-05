//#region Grid...
class StudioListButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', `${urlIndex}/edit?id=${params.data.id}`, 'link-success', 'bi bi-pencil-fill', params.data.id, params.data.studioList, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes, false);
        const deleteLink = createActionLink('Delete', '#deleteStudioList', 'link-danger', 'bi bi-x-octagon-fill', params.data.id, params.data.studioList, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes, true);
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
        { field: "sponsorName", filter: 'agTextColumnFilter' },
        { field: "code", filter: 'agTextColumnFilter' },
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


































