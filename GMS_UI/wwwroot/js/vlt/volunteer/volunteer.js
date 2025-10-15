//#region Grid...
class VolunteerButtonRenderer {
    init(params) {
        this.eGui = document.createElement('div');
        const editLink = createActionLink('Edit', `/VLT/Volunteer/Edit?volunteerId=${params.data.volunteerId}`, 'link-success', 'bi bi-pencil-fill', params.data.volunteerId);
        const deleteLink = createActionLink('Delete', '#deleteVolunteer', 'link-danger', 'bi bi-x-octagon-fill', params.data.volunteerId,
            params.data.firstName, params.data.lastName);
        this.eGui.appendChild(editLink);
        this.eGui.appendChild(document.createTextNode(' | '));
        this.eGui.appendChild(deleteLink);
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
    enableAdvancedFilter: true,
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
        // For modal links (delete)
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (href === "#deleteVolunteer") {
                $('#volunteerIdDelete').val(volunteerId);
                $('#volunteerNameDelete').html(`${firstName} ${lastName}`);
            }
            $(href).modal('show');
        });
    }
    // For direct navigation (edit), just use the href

    a.appendChild(icon);
    return a;
}
//#endregion
