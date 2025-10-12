let currentStep = 1;
const totalSteps = 8;

// Counters for dynamic lists
let emergencyContactCounter = 0;
let allergyCounter = 0;
let diseaseCounter = 0;
let medicationCounter = 0;
let documentCounter = 0;

// Date formatting for DOB field
$(document).ready(function() {
    // Auto-format DOB as user types
    $('#subjectDOB').on('input', function(e) {
        let value = $(this).val().replace(/\D/g, ''); // Remove non-digits
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        $(this).val(value);
    });

    // Validate date on blur
    $('#subjectDOB').on('blur', function() {
        const dateStr = $(this).val();
        if (dateStr && !isValidDate(dateStr)) {
            $(this).addClass('is-invalid');
            alert('Please enter a valid date in MM/DD/YYYY format');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
});

// Validate date format
function isValidDate(dateStr) {
    if (!dateStr) return true; // Allow empty
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
}

// Convert MM/DD/YYYY to YYYY-MM-DD for backend
function convertDateToISO(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr; // Return as-is if not in expected format

    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${year}-${month}-${day}`;
}

function changeStep(direction) {
    if (direction === 1) {
        // Validate current step before proceeding
        if (!validateStep(currentStep)) {
            return;
        }
    }

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

    // Load dropdowns and grids for medical steps
    console.log('Current step:', currentStep);
    if (currentStep === 5) {
        console.log('Loading allergies for step 5');
        loadAllergiesDropdown();
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        console.log('Loading diseases for step 6');
        loadDiseasesDropdown();
        setupDiseasesGrid();
    } else if (currentStep === 7) {
        console.log('Loading medications for step 7');
        loadMedicationsDropdown();
        setupMedicationsGrid();
    }

    // Update review summary on last step
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }
}

function validateStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }

    return isValid;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    submitBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
}

// Cancel wizard and return to volunteer list
function cancelWizard() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        window.location.href = '/VLT/Volunteer/Index';
    }
}

// Jump to a specific step by clicking on step indicator
function jumpToStep(targetStep) {
    if (targetStep === currentStep) return; // Already on this step

    // If going forward, validate all steps in between
    if (targetStep > currentStep) {
        for (let i = currentStep; i < targetStep; i++) {
            if (!validateStep(i)) {
                alert(`Please complete step ${i} before jumping ahead.`);
                return;
            }
        }
    }

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

    // Load dropdowns and grids for medical steps
    console.log('Current step:', currentStep);
    if (currentStep === 5) {
        console.log('Loading allergies for step 5');
        loadAllergiesDropdown();
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        console.log('Loading diseases for step 6');
        loadDiseasesDropdown();
        setupDiseasesGrid();
    } else if (currentStep === 7) {
        console.log('Loading medications for step 7');
        loadMedicationsDropdown();
        setupMedicationsGrid();
    }

    // Update review summary on last step
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }
}

// Emergency Contact Functions
function addEmergencyContact() {
    emergencyContactCounter++;
    const container = document.getElementById('emergencyContactsContainer');
    const contactDiv = document.createElement('div');
    contactDiv.className = 'card mb-3';
    contactDiv.id = `emergencyContact${emergencyContactCounter}`;
    contactDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Emergency Contact ${emergencyContactCounter}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeEmergencyContact(${emergencyContactCounter})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Contact Name *</label>
                    <input type="text" class="form-control" id="contactName${emergencyContactCounter}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Contact Phone *</label>
                    <input type="tel" class="form-control" id="contactPhone${emergencyContactCounter}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Relation</label>
                    <select class="form-select" id="contactRelation${emergencyContactCounter}">
                        <option value="0">Select Relation</option>
                        <option value="1">Parent</option>
                        <option value="2">Spouse</option>
                        <option value="3">Sibling</option>
                        <option value="4">Friend</option>
                        <option value="5">Other</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    container.appendChild(contactDiv);
}

function removeEmergencyContact(id) {
    const element = document.getElementById(`emergencyContact${id}`);
    if (element) {
        element.remove();
    }
}

// Allergy Functions
function addAllergy() {
    allergyCounter++;
    const container = document.getElementById('allergiesContainer');
    const allergyDiv = document.createElement('div');
    allergyDiv.className = 'card mb-3';
    allergyDiv.id = `allergy${allergyCounter}`;

    let optionsHtml = '<option value="">Select Allergy</option>';
    window.allergyList.forEach(item => {
        optionsHtml += `<option value="${item.value}">${item.text}</option>`;
    });

    allergyDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Allergy ${allergyCounter}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeAllergy(${allergyCounter})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Allergy</label>
                    <select class="form-select" id="allergyId${allergyCounter}">
                        ${optionsHtml}
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="allergyStartDate${allergyCounter}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" id="allergyEndDate${allergyCounter}">
                </div>
            </div>
        </div>
    `;
    container.appendChild(allergyDiv);
}

function removeAllergy(id) {
    const element = document.getElementById(`allergy${id}`);
    if (element) {
        element.remove();
    }
}

// Disease Functions
function addDisease() {
    diseaseCounter++;
    const container = document.getElementById('diseasesContainer');
    const diseaseDiv = document.createElement('div');
    diseaseDiv.className = 'card mb-3';
    diseaseDiv.id = `disease${diseaseCounter}`;

    let optionsHtml = '<option value="">Select Disease</option>';
    window.diseaseList.forEach(item => {
        optionsHtml += `<option value="${item.value}">${item.text}</option>`;
    });

    diseaseDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Disease ${diseaseCounter}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeDisease(${diseaseCounter})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Disease</label>
                    <select class="form-select" id="diseaseId${diseaseCounter}">
                        ${optionsHtml}
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="diseaseStartDate${diseaseCounter}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" id="diseaseEndDate${diseaseCounter}">
                </div>
            </div>
        </div>
    `;
    container.appendChild(diseaseDiv);
}

function removeDisease(id) {
    const element = document.getElementById(`disease${id}`);
    if (element) {
        element.remove();
    }
}

// Medication Functions
function addMedication() {
    medicationCounter++;
    const container = document.getElementById('medicationsContainer');
    const medicationDiv = document.createElement('div');
    medicationDiv.className = 'card mb-3';
    medicationDiv.id = `medication${medicationCounter}`;

    let optionsHtml = '<option value="">Select Medication</option>';
    window.medicationList.forEach(item => {
        optionsHtml += `<option value="${item.value}">${item.text}</option>`;
    });

    medicationDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Medication ${medicationCounter}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeMedication(${medicationCounter})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">Medication Name</label>
                    <input type="text" class="form-control" id="medicationName${medicationCounter}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Dose</label>
                    <input type="text" class="form-control" id="medicationDose${medicationCounter}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="medicationStartDate${medicationCounter}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" id="medicationEndDate${medicationCounter}">
                </div>
            </div>
        </div>
    `;
    container.appendChild(medicationDiv);
}

function removeMedication(id) {
    const element = document.getElementById(`medication${id}`);
    if (element) {
        element.remove();
    }
}

// Document Functions
function addDocument() {
    documentCounter++;
    const container = document.getElementById('documentsContainer');
    const documentDiv = document.createElement('div');
    documentDiv.className = 'card mb-3';
    documentDiv.id = `document${documentCounter}`;

    documentDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Document ${documentCounter}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeDocument(${documentCounter})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">Document Type</label>
                    <input type="number" class="form-control" id="documentTypeId${documentCounter}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Document Name</label>
                    <input type="text" class="form-control" id="docName${documentCounter}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" id="docDate${documentCounter}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Version</label>
                    <input type="text" class="form-control" id="docVersion${documentCounter}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Active</label>
                    <select class="form-select" id="docActive${documentCounter}">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-12">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="docNotes${documentCounter}" rows="2"></textarea>
                </div>
            </div>
        </div>
    `;
    container.appendChild(documentDiv);
}

function removeDocument(id) {
    const element = document.getElementById(`document${id}`);
    if (element) {
        element.remove();
    }
}

function updateReviewSummary() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const subjectDOB = document.getElementById('subjectDOB').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('subjectEmail').value;
    const address = document.getElementById('address1').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    const summary = document.getElementById('reviewSummary');
    summary.innerHTML = `
        <strong>Name:</strong> ${firstName} ${lastName}<br>
        <strong>Date of Birth:</strong> ${subjectDOB ? new Date(subjectDOB).toLocaleDateString() : ''}<br>
        <strong>Phone:</strong> ${phone}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Address:</strong> ${address}, ${city}, ${state}<br>
        <strong>Emergency Contacts:</strong> ${emergencyContactCounter}<br>
        <strong>Allergies:</strong> ${allergiesData.length}<br>
        <strong>Diseases:</strong> ${diseasesData.length}<br>
        <strong>Medications:</strong> ${medicationsData.length}<br>
        <strong>Documents:</strong> ${documentCounter}
    `;
}

function submitForm() {
    if (!document.getElementById('confirmSubmission').checked) {
        alert('Please confirm that all information is accurate before submitting.');
        return;
    }

    // Collect all form data
    const volunteerData = {
        VolunteerGeneralData: [{
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            MiddleName: document.getElementById('middleName').value,
            SubjectDOB: convertDateToISO(document.getElementById('subjectDOB').value),
            SubjectSS: document.getElementById('subjectSS').value,
            Phone: document.getElementById('phone').value,
            SubjectEmail: document.getElementById('subjectEmail').value,
            SubjectId: document.getElementById('subjectId').value,
            Weight: document.getElementById('weight').value,
            Height: document.getElementById('height').value,
            Sex: parseInt(document.getElementById('sex').value) || 0,
            Gender: parseInt(document.getElementById('gender').value) || 0,
            Race: parseInt(document.getElementById('race').value) || 0,
            Ethnicity: parseInt(document.getElementById('ethnicity').value) || 0,
            Language: parseInt(document.getElementById('language').value) || 0,
            Address1: document.getElementById('address1').value,
            Address2: document.getElementById('address2').value,
            City: document.getElementById('city').value,
            State: document.getElementById('state').value,
            ZipCode: document.getElementById('zipCode').value,
            Country: document.getElementById('country').value,
            LegalRepresentative: document.getElementById('legalRepresentative').value,
            CompanyId: 1,
            SiteId: 1,
            Active: true
        }],
        VolunteerEmergencyContactData: [],
        VolunteerAllergyData: [],
        VolunteerDeseaseData: [],
        VolunteerMedicationData: [],
        VolunteerDocumentationData: []
    };

    // Collect emergency contacts
    for (let i = 1; i <= emergencyContactCounter; i++) {
        const contactName = document.getElementById(`contactName${i}`);
        if (contactName && contactName.value) {
            volunteerData.VolunteerEmergencyContactData.push({
                ContactName: contactName.value,
                ContactPhone: document.getElementById(`contactPhone${i}`).value,
                ContactRelation: parseInt(document.getElementById(`contactRelation${i}`).value) || 0,
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        }
    }

    // Collect allergies from step data - only if there are any
    if (allergiesData.length > 0) {
        allergiesData.forEach(allergy => {
            volunteerData.VolunteerAllergyData.push({
                AllergyId: allergy.id,
                StartDate: allergy.startDate || '0001-01-01',
                EndDate: allergy.endDate || '0001-01-01',
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        });
    }

    // Collect diseases from step data - only if there are any
    if (diseasesData.length > 0) {
        diseasesData.forEach(disease => {
            volunteerData.VolunteerDeseaseData.push({
                DiseaseId: disease.id,
                StartDate: disease.startDate && disease.startDate !== '0001-01-01' ? disease.startDate : '0001-01-01',
                EndDate: disease.endDate && disease.endDate !== '0001-01-01' ? disease.endDate : '0001-01-01',
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        });
    }

    // Collect medications from step data - only if there are any
    if (medicationsData.length > 0) {
        medicationsData.forEach(medication => {
            volunteerData.VolunteerMedicationData.push({
                MedicationId: medication.id,
                DrogName: medication.name,
                DrogDose: '',
                StartDate: medication.startDate || '0001-01-01',
                EndDate: medication.endDate || '0001-01-01',
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        });
    }

    // Collect documents
    for (let i = 1; i <= documentCounter; i++) {
        const docName = document.getElementById(`docName${i}`);
        if (docName && docName.value) {
            const docDate = document.getElementById(`docDate${i}`).value || '0001-01-01';
            volunteerData.VolunteerDocumentationData.push({
                DocumentTypeId: parseInt(document.getElementById(`documentTypeId${i}`).value) || 0,
                DocName: docName.value,
                DocDate: docDate,
                DocVersion: document.getElementById(`docVersion${i}`).value,
                DocActive: document.getElementById(`docActive${i}`).value === 'true',
                Notes: document.getElementById(`docNotes${i}`).value,
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        }
    }

    // Submit via AJAX
    console.log('=== SUBMITTING VOLUNTEER DATA ===');
    console.log('Volunteer Data:', JSON.stringify(volunteerData, null, 2));
    console.log('URL:', window.location.pathname + '?handler=Create');
    console.log('CSRF Token:', window._csrfToken);
    console.log('Allergies count:', volunteerData.VolunteerAllergyData.length);
    console.log('Diseases count:', volunteerData.VolunteerDeseaseData.length);
    console.log('Medications count:', volunteerData.VolunteerMedicationData.length);

    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=Create',
        data: JSON.stringify(volunteerData),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken,
            'X-CSRF-TOKEN': window._csrfToken
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("XSRF-TOKEN", window._csrfToken);
            console.log('Request being sent...');
        },
        success: function (response) {
            console.log('=== RESPONSE RECEIVED ===');
            console.log('Full Response:', response);
            console.log('Response.success:', response.success);
            console.log('Response.message:', response.message);
            console.log('Response type:', typeof response);

            if (response.success) {
                alert('Volunteer created successfully!');
                window.location.href = '/VLT/Volunteer/Index';
            } else {
                const errorMsg = response.message || response.Message || 'Unknown error occurred';
                console.error('Error details:', response);
                console.error('Full error message:', errorMsg);
                alert('Error: ' + errorMsg);
            }
        },
        error: function (xhr, status, error) {
            console.error('=== AJAX ERROR ===');
            console.error('AJAX Error:', {
                status: status,
                error: error,
                responseText: xhr.responseText,
                statusCode: xhr.status
            });

            let errorMessage = 'Unknown error occurred';
            if (xhr.responseText) {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    errorMessage = errorData.message || errorData.title || xhr.responseText;
                } catch (e) {
                    errorMessage = xhr.responseText;
                }
            }

            alert('Error submitting form: ' + errorMessage);
        }
    });
}

// Initialize navigation buttons
updateNavigationButtons();

// ========== Medical Information Steps ==========

// Arrays to store medical data
let allergiesData = [];
let diseasesData = [];
let medicationsData = [];

// Grid APIs
let allergiesGridApi;
let diseasesGridApi;
let medicationsGridApi;

// Load Allergies Dropdown
function loadAllergiesDropdown() {
    console.log('loadAllergiesDropdown called');
    console.log('window.allergyList:', window.allergyList);
    const select = $('#allergySelect');
    console.log('allergySelect element found:', select.length > 0);
    select.empty();
    select.append('<option value="">Select Allergy</option>');
    if (window.allergyList && window.allergyList.length > 0) {
        window.allergyList.forEach(allergy => {
            select.append($('<option>', {
                value: allergy.value,
                text: allergy.text
            }));
        });
        console.log('Loaded', window.allergyList.length, 'allergies');
    } else {
        console.warn('window.allergyList is empty or undefined');
    }
}

// Setup Allergies Grid (in Step 5)
function setupAllergiesGrid() {
    const gridOptions = {
        rowData: allergiesData,
        columnDefs: [
            { field: "id", hide: true },
            { field: "name", headerName: "Allergy", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <button class="btn btn-sm btn-danger" onclick="deleteAllergy(${params.node.rowIndex})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#allergiesGrid');
    gridDiv.innerHTML = '';
    allergiesGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

// Save Allergy
function saveAllergy() {
    const allergyId = $('#allergySelect').val();
    const startDate = $('#allergyStartDate').val();
    const endDate = $('#allergyEndDate').val();

    if (!allergyId) {
        $('#validateAllergy').text('Please select an allergy');
        return;
    }

    $('#validateAllergy').text('');

    const allergyName = $('#allergySelect option:selected').text();
    const allergyItem = {
        id: parseInt(allergyId),
        name: allergyName,
        startDate: startDate || '0001-01-01',
        endDate: endDate || '0001-01-01'
    };

    // Check if already exists
    if (allergiesData.some(a => a.id === allergyItem.id)) {
        $('#validateAllergy').text('This allergy is already added');
        return;
    }

    // Add new
    allergiesData.push(allergyItem);
    setupAllergiesGrid();

    // Reset form
    $('#allergySelect').val('');
    $('#allergyStartDate').val('');
    $('#allergyEndDate').val('');
}

// Delete Allergy
function deleteAllergy(index) {
    if (!confirm('Are you sure you want to remove this allergy?')) {
        return;
    }
    allergiesData.splice(index, 1);
    setupAllergiesGrid();
}

// Load Diseases Dropdown
function loadDiseasesDropdown() {
    console.log('loadDiseasesDropdown called');
    console.log('window.diseaseList:', window.diseaseList);
    const select = $('#diseaseSelect');
    console.log('diseaseSelect element found:', select.length > 0);
    select.empty();
    select.append('<option value="">Select Disease</option>');
    if (window.diseaseList && window.diseaseList.length > 0) {
        window.diseaseList.forEach(disease => {
            select.append($('<option>', {
                value: disease.value,
                text: disease.text
            }));
        });
        console.log('Loaded', window.diseaseList.length, 'diseases');
    } else {
        console.warn('window.diseaseList is empty or undefined');
    }
}

// Setup Diseases Grid (in Step 6)
function setupDiseasesGrid() {
    const gridOptions = {
        rowData: diseasesData,
        columnDefs: [
            { field: "id", hide: true },
            { field: "name", headerName: "Disease", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <button class="btn btn-sm btn-danger" onclick="deleteDisease(${params.node.rowIndex})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#diseasesGrid');
    gridDiv.innerHTML = '';
    diseasesGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

// Save Disease
function saveDisease() {
    const diseaseId = $('#diseaseSelect').val();
    const startDate = $('#diseaseStartDate').val();
    const endDate = $('#diseaseEndDate').val();

    if (!diseaseId) {
        $('#validateDisease').text('Please select a disease');
        return;
    }

    $('#validateDisease').text('');

    const diseaseName = $('#diseaseSelect option:selected').text();
    const diseaseItem = {
        id: parseInt(diseaseId),
        name: diseaseName,
        startDate: startDate || '0001-01-01',
        endDate: endDate || '0001-01-01'
    };

    // Check if already exists
    if (diseasesData.some(d => d.id === diseaseItem.id)) {
        $('#validateDisease').text('This disease is already added');
        return;
    }

    // Add new
    diseasesData.push(diseaseItem);
    setupDiseasesGrid();

    // Reset form
    $('#diseaseSelect').val('');
    $('#diseaseStartDate').val('');
    $('#diseaseEndDate').val('');
}

// Delete Disease
function deleteDisease(index) {
    if (!confirm('Are you sure you want to remove this disease?')) {
        return;
    }
    diseasesData.splice(index, 1);
    setupDiseasesGrid();
}

// Load Medications Dropdown
function loadMedicationsDropdown() {
    console.log('loadMedicationsDropdown called');
    console.log('window.medicationList:', window.medicationList);
    const select = $('#medicationSelect');
    console.log('medicationSelect element found:', select.length > 0);
    select.empty();
    select.append('<option value="">Select Medication</option>');
    if (window.medicationList && window.medicationList.length > 0) {
        window.medicationList.forEach(medication => {
            select.append($('<option>', {
                value: medication.value,
                text: medication.text
            }));
        });
        console.log('Loaded', window.medicationList.length, 'medications');
    } else {
        console.warn('window.medicationList is empty or undefined');
    }
}

// Setup Medications Grid (in Step 7)
function setupMedicationsGrid() {
    const gridOptions = {
        rowData: medicationsData,
        columnDefs: [
            { field: "id", hide: true },
            { field: "name", headerName: "Medication", flex: 2 },
            {
                field: "startDate",
                headerName: "Start Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                field: "endDate",
                headerName: "End Date",
                flex: 1,
                valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ''
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <button class="btn btn-sm btn-danger" onclick="deleteMedication(${params.node.rowIndex})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `;
                }
            }
        ],
        domLayout: 'normal'
    };

    const gridDiv = document.querySelector('#medicationsGrid');
    gridDiv.innerHTML = '';
    medicationsGridApi = agGrid.createGrid(gridDiv, gridOptions);
}

// Save Medication
function saveMedication() {
    const medicationId = $('#medicationSelect').val();
    const startDate = $('#medicationStartDate').val();
    const endDate = $('#medicationEndDate').val();

    if (!medicationId) {
        $('#validateMedication').text('Please select a medication');
        return;
    }

    $('#validateMedication').text('');

    const medicationName = $('#medicationSelect option:selected').text();
    const medicationItem = {
        id: parseInt(medicationId),
        name: medicationName,
        startDate: startDate || '0001-01-01',
        endDate: endDate || '0001-01-01'
    };

    // Check if already exists
    if (medicationsData.some(m => m.id === medicationItem.id)) {
        $('#validateMedication').text('This medication is already added');
        return;
    }

    // Add new
    medicationsData.push(medicationItem);
    setupMedicationsGrid();

    // Reset form
    $('#medicationSelect').val('');
    $('#medicationStartDate').val('');
    $('#medicationEndDate').val('');
}

// Delete Medication
function deleteMedication(index) {
    if (!confirm('Are you sure you want to remove this medication?')) {
        return;
    }
    medicationsData.splice(index, 1);
    setupMedicationsGrid();
}

