let currentStep = 1;
const totalSteps = 8;

// Arrays to store medical data for grids
let allergiesData = [];
let diseasesData = [];
let medicationsData = [];

// Grid APIs
let allergiesGridApi;
let diseasesGridApi;
let medicationsGridApi;

// Navigation functions
function changeStep(direction) {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');

    // Update step indicator
    const currentIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        currentIndicator.classList.remove('active');
        currentIndicator.classList.add('completed');
        currentIndicator.innerHTML = '<i class="bi bi-check"></i>';

        if (currentStep < totalSteps) {
            const line = document.getElementById(`line${currentStep}`);
            line.classList.add('completed');
        }
    } else {
        currentIndicator.classList.remove('completed');
        currentIndicator.classList.add('active');
        currentIndicator.innerHTML = currentStep;
    }

    currentStep += direction;

    // Show new step
    const newStepElement = document.getElementById(`step${currentStep}`);
    newStepElement.classList.add('active');

    // Update new step indicator
    const newIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        newIndicator.classList.add('active');
    }

    // Update navigation buttons
    updateNavigationButtons();

    // Setup grids when navigating to medical steps
    if (currentStep === 5) {
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        setupDiseasesGrid();
    } else if (currentStep === 7) {
        setupMedicationsGrid();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = document.getElementById('closeBtn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    closeBtn.style.display = 'inline-block';
}

// Close wizard and return to calling page
function closeWizard() {
    const returnUrl = document.getElementById('returnUrl').value || '/SUB/Subject/Index';
    window.location.href = returnUrl;
}

// Jump to a specific step by clicking on step indicator
function jumpToStep(targetStep) {
    if (targetStep === currentStep) return;

    // Remove active/completed from current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    const currentIndicator = document.getElementById(`step${currentStep}-indicator`);
    currentIndicator.classList.remove('active');

    // Mark steps as completed or active based on direction
    if (targetStep > currentStep) {
        // Going forward - mark intermediate steps as completed
        for (let i = currentStep; i < targetStep; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            indicator.classList.add('completed');
            indicator.classList.remove('active');
            indicator.innerHTML = '<i class="bi bi-check"></i>';

            if (i < totalSteps) {
                const line = document.getElementById(`line${i}`);
                line.classList.add('completed');
            }
        }
    } else {
        // Going backward - remove completed status
        for (let i = targetStep; i < currentStep; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            indicator.classList.remove('completed');
            indicator.innerHTML = i;

            if (i < totalSteps) {
                const line = document.getElementById(`line${i}`);
                line.classList.remove('completed');
            }
        }
    }

    // Update current step
    currentStep = targetStep;

    // Show new step
    const newStepElement = document.getElementById(`step${currentStep}`);
    newStepElement.classList.add('active');
    const newIndicator = document.getElementById(`step${currentStep}-indicator`);
    newIndicator.classList.add('active');

    // Update navigation buttons
    updateNavigationButtons();

    // Setup grids for medical steps
    if (currentStep === 5) {
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        setupDiseasesGrid();
    } else if (currentStep === 7) {
        setupMedicationsGrid();
    }
}

// Setup Allergies Grid (Read-Only)
function setupAllergiesGrid() {
    const gridOptions = {
        rowData: allergiesData,
        columnDefs: [
            { field: "name", headerName: "Allergy", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#allergiesGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        allergiesGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

// Setup Diseases Grid (Read-Only)
function setupDiseasesGrid() {
    const gridOptions = {
        rowData: diseasesData,
        columnDefs: [
            { field: "name", headerName: "Disease", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#diseasesGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        diseasesGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

// Setup Medications Grid (Read-Only)
function setupMedicationsGrid() {
    const gridOptions = {
        rowData: medicationsData,
        columnDefs: [
            { field: "name", headerName: "Medication", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value && params.value !== '0001-01-01' ? new Date(params.value).toLocaleDateString() : ''
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#medicationsGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        medicationsGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

// Initialize navigation buttons
updateNavigationButtons();

// Populate form with volunteer data
if (window.volunteerData) {
    console.log('Loading volunteer data for viewing:', window.volunteerData);
    populateFormData();
} else {
    console.error('window.volunteerData is null or undefined');
}

function populateFormData() {
    const data = window.volunteerData;

    if (!data) {
        console.error('volunteerData is null or undefined');
        return;
    }

    // Handle both lowercase and uppercase property names
    const header = data.header || data.Header;

    if (!header) {
        console.error('No header data found in volunteer data');
        return;
    }

    // Populate general information
    document.getElementById('flag').value = header.flag || 0;
    document.getElementById('flagReason').value = header.flagReason || '';
    document.getElementById('firstName').value = header.firstName || '';
    document.getElementById('middleName').value = header.middleName || '';
    document.getElementById('lastName').value = header.lastName || '';

    // Parse date from format "MM/DD/YYYY HH:mm:ss" to "MM/DD/YYYY"
    let dobValue = '';
    if (header.subjectDOB) {
        const dobParts = header.subjectDOB.split(' ')[0].split('/');
        if (dobParts.length === 3) {
            dobValue = `${dobParts[0].padStart(2, '0')}/${dobParts[1].padStart(2, '0')}/${dobParts[2]}`;
        }
    }
    document.getElementById('subjectDOB').value = dobValue;

    document.getElementById('subjectSS').value = header.subjectSS || '';
    document.getElementById('phone').value = header.phone || '';
    document.getElementById('subjectEmail').value = header.subjectEmail || '';
    document.getElementById('subjectId').value = header.subjectId || '';

    // Populate physical & demographics
    document.getElementById('weight').value = (header.weight || '').trim();
    document.getElementById('height').value = (header.height || '').trim();
    document.getElementById('sex').value = header.sexId || '';
    document.getElementById('gender').value = header.genderId || '';
    document.getElementById('race').value = header.raceId || '';
    document.getElementById('ethnicity').value = header.ethnicityId || '';
    document.getElementById('language').value = header.languageId || '';
    document.getElementById('currentStatus').value = header.currentStatusId || '';

    // Populate address
    document.getElementById('address1').value = header.address1 || '';
    document.getElementById('address2').value = header.address2 || '';
    document.getElementById('city').value = header.city || '';
    document.getElementById('state').value = header.state || '';
    document.getElementById('zipCode').value = header.zipCode || '';
    document.getElementById('country').value = header.country || '';
    document.getElementById('legalRepresentative').value = header.legalRepresentative || '';

    // Populate emergency contacts (read-only display)
    const emergencyContacts = data.emergencyContacts || [];
    const emergencyContactsContainer = document.getElementById('emergencyContactsContainer');

    if (emergencyContacts.length > 0) {
        let html = '';
        emergencyContacts.forEach((contact, index) => {
            const relationName = getRelationName(contact.relationTypeId);
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="mb-3">Emergency Contact ${index + 1}</h6>
                        <div class="row">
                            <div class="col-md-4">
                                <label class="form-label">Contact Name</label>
                                <input type="text" class="form-control" value="${contact.contactName || ''}" readonly>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contact Phone</label>
                                <input type="text" class="form-control" value="${contact.contactPhone || ''}" readonly>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Relation</label>
                                <input type="text" class="form-control" value="${relationName}" readonly>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        emergencyContactsContainer.innerHTML = html;
    } else {
        document.getElementById('noContactsMsg').style.display = 'block';
    }

    // Populate allergies
    const allergies = data.allergies || [];
    allergiesData = [];
    if (allergies.length > 0) {
        allergies.forEach(allergy => {
            allergiesData.push({
                name: allergy.allergy || '',
                startDate: allergy.startDate || '0001-01-01',
                endDate: allergy.endDate || '0001-01-01'
            });
        });
    }

    // Populate diseases
    const diseases = data.diseases || [];
    diseasesData = [];
    if (diseases.length > 0) {
        diseases.forEach(disease => {
            diseasesData.push({
                name: disease.diseaseName || '',
                startDate: disease.startDate || '0001-01-01',
                endDate: disease.endDate || '0001-01-01'
            });
        });
    }

    // Populate medications
    const medications = data.medications || [];
    medicationsData = [];
    if (medications.length > 0) {
        medications.forEach(med => {
            medicationsData.push({
                name: med.drogName || '',
                startDate: med.startDate || '0001-01-01',
                endDate: med.endDate || '0001-01-01'
            });
        });
    }

    // Populate documents (read-only display)
    const documentations = data.documentations || [];
    const documentsContainer = document.getElementById('documentsContainer');

    if (documentations.length > 0) {
        let html = '';
        documentations.forEach((doc, index) => {
            const docDate = doc.docDate && doc.docDate !== '0001-01-01' ? new Date(doc.docDate).toLocaleDateString() : '';
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="mb-3">Document ${index + 1}</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label">Document Name</label>
                                <input type="text" class="form-control" value="${doc.docName || ''}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Date</label>
                                <input type="text" class="form-control" value="${docDate}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Version</label>
                                <input type="text" class="form-control" value="${doc.docVersion || ''}" readonly>
                            </div>
                        </div>
                        ${doc.notes ? `
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" rows="2" readonly>${doc.notes}</textarea>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        documentsContainer.innerHTML = html;
    } else {
        document.getElementById('noDocsMsg').style.display = 'block';
    }
}

// Helper function to get relation name
function getRelationName(relationTypeId) {
    const relations = {
        0: 'Unknown',
        1: 'Parent',
        2: 'Spouse',
        3: 'Sibling',
        4: 'Friend',
        5: 'Other'
    };
    return relations[relationTypeId] || 'Unknown';
}
