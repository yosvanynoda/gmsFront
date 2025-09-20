//#region Grid...
class ProtocolButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editProtocol', 'link-success', 'bi bi-pencil-fill', params.data.id, params.data.protocol,params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes);
        const deleteLink = createActionLink('Delete', '#deleteProtocol', 'link-danger', 'bi bi-x-octagon-fill', params.data.id, params.data.protocol, params.data.datecreated,
            params.data.version, params.data.siteId, params.data.notes);
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
        { field: "protocol", filter: 'agTextColumnFilter' },       
        { field: "dateCreated", filter: true, hide: true },
        { field: "version", filter: 'agTextColumnFilter' },     
        { field: "studioName", filter: 'agTextColumnFilter', headerName: "Study" },
        {
            field: "dateCreated",
            filter: 'agTextColumnFilter',
            headerName: "Approved Date",
            cellRenderer: (data) => {
                return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "startDate",
            filter: 'agTextColumnFilter',
            cellRenderer: (data) => {
                return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
        },
        {
            field: "endDate",
            filter: 'agTextColumnFilter',
            cellRenderer: (data) => {
                return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
        },
        { field: "notes", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "actionDate", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "active", filter: true, hide: true },
        { field: "lastUpdateAt", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: ProtocolButtonRenderer,
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
    console.log(data);
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#protocolGrid"), gridOptions);
    //alert('done');
}
//#endregion

//#region general functions create links...
// Helper function to create each action link

function createActionLink(title, href, linkClass, iconClass, id, protocol, datecreated, version, siteId, notes) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;
    a.addEventListener('click', () => {
        if (href == "#editProtocol") {
            $('#protocolEdit').val(protocol);
            $('#versionEdit').val(version);         
            $('#protocolidEdit').val(id);
            $('#datecreatedEdit').val(datecreated);
            $('#notesEdit').val(notes);
            $('#siteIdEdit').val(siteId);

        }
        else {
            $('#protocolD').html(protocol);
            $('#versionD').html(version);
            $('#siteIdD').html(siteId);
            $('#protocolidDelete').val(id);
        }
        $(href).modal('show');
    });
    a.appendChild(icon);

    return a;
}

//#endregion

//#region Add Protocol

function crudProtocol(action) {
    $('#validateProtocol').html('');
    let protocol = '';
    let version = '';
    let email = '';
    let phone = '';
    let role = '';
    let id = 0;
    let siteId = 0;
    switch (action) {
        case 1: // Add
            protocol = $("#protocol").val();
            if (protocol === "") {
                $('#validateProtocol').html('Please enter an protocol');
                $('#validateProtocol').show();
                return;
            }

            version = $("#version").val();
            email = $("#email").val();
            phone = $("#phone").val();
            role = $("#role").val();
            siteId = $("#siteId").val();
            id = 0; // New gender, so id is 0
            $('#protocol').val('');
            $('#version').val('');
            $('#email').val('');
            $('#phone').val('');
            $('#role').val('');
            $('#siteId').val('');
            $('#protocolNewModal').modal('hide');
            break;
        case 2: // Edit
            protocol = $("#protocolEdit").val();
            if (protocol === "") {
                $('#validateProtocol').html('Please enter an protocol');
                $('#validateProtocol').show();
                return;
            }
            version = $("#versionEdit").val();
            id = $("#protocolidEdit").val(); // Get the id from the hidden input
            email = $("#emailEdit").val();
            phone = $("#phoneEdit").val();
            role = $("#roleEdit").val();
            siteId = $("#siteIdEdit").val();
            $('#protocolEdit').val('');
            $('#lastNamEdite').val('');
            $('#emailEdit').val('');
            $('#phoneEdit').val('');
            $('#siteIdEdit').val('');
            $('#editProtocol').modal('hide');
            break;
        case 3: // Delete
            protocol = 'N/A';
            id = $("#protocolidDelete").val(); // Get the id from the hidden input
            $('#protocolidDelete').val('');
            $('#deleteProtocol').modal('hide');
            break;
    }

    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudProtocol',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "id": id, "protocol": protocol, "datecreated": datecreated, "version": version, "siteId": siteId, "notes": notes, "action": action },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('Protocol');
                $('#failedMsg').html('Protocol failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('Protocol');
                $('#successMsg').html('Protocol was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex,
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        $('#protocolGrid').html('');
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
            $('#failedTitle').html('Protocol');
            $('#failedMsg').html('Protocol failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Protocol');
            $('#failedMsg').html('Protocol failed. Please try again');
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


































