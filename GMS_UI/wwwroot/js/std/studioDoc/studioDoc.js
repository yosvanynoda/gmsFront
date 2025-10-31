//#region Grid...
class StudioDocButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div')
        const editLink = createActionLink('Edit', '#editStudioDoc', 'link-success', 'bi bi-pencil-fill', params.data.id, params.data.docName, params.data.docType,
            params.data.docVersion, params.data.docDate, params.data.studioName, params.data.siteId);
        const deleteLink = createActionLink('Delete', '#deleteStudioDoc', 'link-danger', 'bi bi-x-octagon-fill', params.data.id, params.data.docName, params.data.docType,
            params.data.docVersion, params.data.docDate, params.data.studioName, params.data.siteId);
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
        { field: "docName", filter: 'agTextColumnFilter' },
        { field: "docType", filter: 'agTextColumnFilter' },
        { field: "docVersion", filter: 'agTextColumnFilter' },
        { field: "docDate", filter: 'agTextColumnFilter' },
        { field: "notes", filter: 'agTextColumnFilter' },
        { field: "companyId", filter: true, hide: true },
        { field: "userName", filter: true, hide: true },
        { field: "siteId", filter: true, hide: true },
        { field: "studioName", filter: 'agTextColumnFilter' },
        { field: "active", filter: true, hide: true },
        {
            field: "button",
            headerName: "Actions",
            cellRenderer: StudioDocButtonRenderer,
        }
    ],
    defaultColDef: {
        flex: 1,
    },
    /*enableFilter: true,*/
    pagination: true,
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object


$(function () {
    /*console.log("The DOM is fully loaded!");*/
    // Your code here

    $.ajax({
        type: "POST",
        url: `${urlIndex}?handler=OpenStudy`,
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
    //console.log(data);
    gridOptions.rowData = data;
    gridApi = agGrid.createGrid(document.querySelector("#studioDocGrid"), gridOptions);
    //alert('done');
}
//#endregion

//#region general functions create links...
// Helper function to create each action link


function createActionLink(title, href, linkClass, iconClass, id, studioName, docType, docVersion, docDate, studioName, siteId) {
    const a = document.createElement('a');
    a.setAttribute('data-toggle', 'tooltip');
    a.setAttribute('data-placement', 'top');
    a.setAttribute('title', title);
    a.className = linkClass;
    a.href = href;
    const icon = document.createElement('i');
    icon.className = iconClass;
    a.addEventListener('click', () => {
        if (href == "#editStudioDoc") {
            $('#studioDocidEdit').val(id);
            $('#studioNameEdit').val(studioName);
            $('#docTypeEdit').val(docType);
            $('#docVersionEdit').val(docVersion);
            $('#docDateEdit').val(docDate);
            $('#studioNameEdit').val(studioName);
            $('#siteIdEdit').val(siteId);
        }
        else {
            $('#studioDocidDelete').val(id);
            $('#studioNameD').html(studioName);
            $('#docTypeD').html(docType);
            $('#siteIdD').html(siteId);
        }
        $(href).modal('show');
    });
    a.appendChild(icon);

    return a;
}

//#endregion

//#region Add StudioDoc

function crudStudioDoc(action) {
    $('#validateStudioDoc').html('');
    let id = 0;
    let docName = '';
    let studioName = '';
    let docType = '';
    let docVersion = '';
    let docDate = '';

    switch (action) {
        case 1: // Add
            docName = $("#docName").val();
            if (docName === "") {
                $('#validateStudioDoc').html('Please enter an studioDoc');
                $('#validateStudioDoc').show();
                return;
            }
            docType = $("#docType").val();
            docVersion = $("#docVersion").val();
            docDate = $("#docDate").val();
            studioName = $("#studioName").val();

            id = 0; // New studioDoc, so id is 0
            $('#studioName').val('');
            $('#docType').val('');
            $('#docVersion').val('');
            $('#docDate').val('');
            $('#studioName').val('');

            $('#studioDocNewModal').modal('hide');
            break;
        case 2: // Edit
            docName = $("#docNameEdit").val();
            if (docName === "") {
                $('#validateStudioDoc').html('Please enter an monitor');
                $('#validateStudioDoc').show();
                return;
            }
            docType = $("#docTypeEdit").val();
            id = $("#studioDocidEdit").val(); // Get the id from the hidden input
            docVersion = $("#docVersionEdit").val();
            docDate = $("#docDateEdit").val();
            studioName = $("#studioNameEdit").val();

            $('#studioNameEdit').val('');
            $('#lastNamEdite').val('');
            $('#docVersionEdit').val('');
            $('#docDateEdit').val('');
            $('#studioNameEdit').val('');
            $('#siteIdEdit').val('');
            $('#editStudioDoc').modal('hide');
            break;
        case 3: // Delete
            docName = 'N/A';
            id = $("#docNameidDelete").val(); // Get the id from the hidden input
            $('#studioDocidDelete').val('');
            $('#deleteStudioDoc').modal('hide');
            break;
    }
    $.ajax({
        type: "POST",
        url: urlIndex + '?handler=CrudStudioDoc',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "studioName": studioName, "docType": docType, "docVersion": docVersion, "docDate": docDate },
        success: function (data) {
            if (data.success === false) {
                $('#failedTitle').html('StudioDoc');
                $('#failedMsg').html('StudioDoc failed. Please try again');
                $('#failedAlert').show();
            }
            else {
                $('#successTitle').html('StudioDoc');
                $('#successMsg').html('StudioDoc was saved successfully');
                $('#successAlert').show();
                // Refresh the grid with the new data
                $.ajax({
                    type: "POST",
                    url: urlIndex,
                    headers: { 'RequestVerificationToken': window._csrfToken },
                    success: function (data) {
                        $('#monitorGrid').html('');
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
            $('#failedTitle').html('StudioDoc');
            $('#failedMsg').html('StudioDoc failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('StudioDoc');
            $('#failedMsg').html('StudioDoc failed. Please try again');
            $('#failedAlert').show();
        }
    });

}
//#endregion

//#region General...
function hideAlerts(alertName) {
    $('#' + alertName).hide();
}
//#endregion





