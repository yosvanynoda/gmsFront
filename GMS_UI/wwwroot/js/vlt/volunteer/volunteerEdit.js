let currentStep = 1;
const totalSteps = 8;

// Counters for dynamic lists
let emergencyContactCounter = 0;
let allergyCounter = 0;
let diseaseCounter = 0;
let medicationCounter = 0;
let documentCounter = 0;

// Arrays to store medical data for grid-based approach
let allergiesData = [];
let diseasesData = [];
let medicationsData = [];

// Grid APIs
let allergiesGridApi;
let diseasesGridApi;
let medicationsGridApi;

// Store addressId for updates
let volunteerAddressId = 0;

// Store flag color for conditional updates
let currentFlagColor = '';

// Date formatting for DOB field
$(document).ready(function() {
    // Handle flag dropdown change to get color
    $('#flag').on('change', function() {
        const flagId = $(this).val();
        if (flagId && flagId !== '0') {
            // Fetch flag details to get color
            $.ajax({
                type: "POST",
                url: '/VLT/Volunteer/Edit?handler=FlagColor',
                data: JSON.stringify({ flagId: parseInt(flagId) }),
                contentType: "application/json",
                headers: {
                    'RequestVerificationToken': window._csrfToken,
                    'X-CSRF-TOKEN': window._csrfToken
                },
                success: function(response) {
                    if (response.success) {
                        currentFlagColor = response.color || '';
                    }
                },
                error: function() {
                    currentFlagColor = '';
                }
            });
        } else {
            currentFlagColor = '';
        }
    });

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

// Helper function to format date for DateOnly backend type (always returns YYYY-MM-DD or default)
function formatDateForBackend(dateStr) {
    if (!dateStr || dateStr === '0001-01-01') return '0001-01-01';

    // If already in YYYY-MM-DD format (from date input)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    // If in MM/DD/YYYY or MM/DD/YYYY HH:mm:ss format (from API)
    const dateParts = dateStr.split(' ')[0].split('/');
    if (dateParts.length === 3) {
        const year = dateParts[2];
        const month = dateParts[0].padStart(2, '0');
        const day = dateParts[1].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Default fallback
    return '0001-01-01';
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
    if (currentStep === 5) {
        loadAllergiesDropdown();
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        loadDiseasesDropdown();
        setupDiseasesGrid();
    } else if (currentStep === 7) {
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
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
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
    if (currentStep === 5) {
        loadAllergiesDropdown();
        setupAllergiesGrid();
    } else if (currentStep === 6) {
        loadDiseasesDropdown();
        setupDiseasesGrid();
    } else if (currentStep === 7) {
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
            <input type="hidden" id="contactRecordId${emergencyContactCounter}" value="0" />
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Emergency Contact ${emergencyContactCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeEmergencyContact(${emergencyContactCounter})">
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
            <input type="hidden" id="allergyRecordId${allergyCounter}" value="0" />
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Allergy ${allergyCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeAllergy(${allergyCounter})">
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
            <input type="hidden" id="diseaseRecordId${diseaseCounter}" value="0" />
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Disease ${diseaseCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeDisease(${diseaseCounter})">
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
            <input type="hidden" id="medicationRecordId${medicationCounter}" value="0" />
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Medication ${medicationCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeMedication(${medicationCounter})">
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
            <input type="hidden" id="documentRecordId${documentCounter}" value="0" />
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Document ${documentCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeDocument(${documentCounter})">
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
        <strong>Allergies:</strong> ${allergyCounter}<br>
        <strong>Diseases:</strong> ${diseaseCounter}<br>
        <strong>Medications:</strong> ${medicationCounter}<br>
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
            VolunteerId: 0, // Will be set below
            Flag: parseInt(document.getElementById('flag').value) || 0,
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            MiddleName: document.getElementById('middleName').value,
            SubjectDOB: convertDateToISO(document.getElementById('subjectDOB').value),
            SubjectSS: document.getElementById('subjectSS').value,
            Phone: document.getElementById('phone').value,
            SubjectEmail: document.getElementById('subjectEmail').value,
            Email: document.getElementById('subjectEmail').value, // Duplicate for Email field
            SubjectId: document.getElementById('subjectId').value,
            Weight: document.getElementById('weight').value,
            Height: document.getElementById('height').value,
            Sex: parseInt(document.getElementById('sex').value) || 0,
            Gender: parseInt(document.getElementById('gender').value) || 0,
            Race: parseInt(document.getElementById('race').value) || 0,
            Ethnicity: parseInt(document.getElementById('ethnicity').value) || 0,
            Language: parseInt(document.getElementById('language').value) || 0,
            AddressId: volunteerAddressId,
            Address1: document.getElementById('address1').value,
            Address2: document.getElementById('address2').value,
            City: document.getElementById('city').value,
            State: document.getElementById('state').value,
            ZipCode: document.getElementById('zipCode').value,
            Country: document.getElementById('country').value,
            LegalRepresentative: document.getElementById('legalRepresentative').value,
            DateCreated: new Date().toISOString(),
            CompanyId: "1",
            CurrentStatus: document.getElementById('currentStatus').selectedOptions[0]?.text || '',
            Picture: "",
            UserName: 1,
            Active: true,
            SiteId: 1
        }],
        VolunteerEmergencyContactData: [],
        VolunteerAllergyData: [],
        VolunteerDiseaseData: [],
        VolunteerMedicationData: [],
        VolunteerDocumentationData: []
    };

    // Collect emergency contacts
    for (let i = 1; i <= emergencyContactCounter; i++) {
        const contactName = document.getElementById(`contactName${i}`);
        if (contactName && contactName.value) {
            const contactRecordId = document.getElementById(`contactRecordId${i}`);
            const recordId = contactRecordId ? parseInt(contactRecordId.value) || 0 : 0;

            volunteerData.VolunteerEmergencyContactData.push({
                VoluntierId: parseInt(document.getElementById('volunteerId').value) || 0,  // Note: "VoluntierId" matches UDT typo
                ContactId: recordId,
                ContactName: contactName.value,
                ContactPhone: document.getElementById(`contactPhone${i}`).value,
                ContactRelation: parseInt(document.getElementById(`contactRelation${i}`).value) || 0,
                CompanyId: 1,
                SiteId: 1,
                Active: true,
                UserName: 1
            });
        }
    }

    // Collect allergies from grid data (send ALL items including inactive ones)
    const vId = parseInt(document.getElementById('volunteerId').value) || 0;
    allergiesData.forEach(allergy => {
        volunteerData.VolunteerAllergyData.push({
            VId: vId,
            VolunteerAllergyId: allergy.recordId || 0,
            AllergyId: parseInt(allergy.id),
            StartDate: formatDateForBackend(allergy.startDate),
            EndDate: formatDateForBackend(allergy.endDate),
            CompanyId: 1,
            SiteId: 1,
            Active: allergy.active !== false,
            UserName: 1
        });
    });

    // Collect diseases from grid data (send ALL items including inactive ones)
    diseasesData.forEach(disease => {
        volunteerData.VolunteerDiseaseData.push({
            VId: vId,
            VolunteerDiseaseId: disease.recordId || 0,
            DiseaseId: parseInt(disease.id),
            StartDate: formatDateForBackend(disease.startDate),
            EndDate: formatDateForBackend(disease.endDate),
            CompanyId: 1,
            SiteId: 1,
            Active: disease.active !== false,
            UserName: 1
        });
    });

    // Collect medications from grid data (send ALL items including inactive ones)
    medicationsData.forEach(medication => {
        volunteerData.VolunteerMedicationData.push({
            VId: vId,
            VolunteerMedicationId: medication.recordId || 0,
            MedicationId: parseInt(medication.id),
            DrogName: medication.name,
            DrogDose: medication.dose || '',
            StartDate: formatDateForBackend(medication.startDate),
            EndDate: formatDateForBackend(medication.endDate),
            CompanyId: 1,
            SiteId: 1,
            Active: medication.active !== false,
            UserName: 1
        });
    });

    // Collect documents
    for (let i = 1; i <= documentCounter; i++) {
        const docName = document.getElementById(`docName${i}`);
        if (docName && docName.value) {
            const documentRecordId = document.getElementById(`documentRecordId${i}`);
            const recordId = documentRecordId ? parseInt(documentRecordId.value) || 0 : 0;

            const docDate = document.getElementById(`docDate${i}`).value || '0001-01-01';
            volunteerData.VolunteerDocumentationData.push({
                DocId: recordId,
                DocumentTypeId: parseInt(document.getElementById(`documentTypeId${i}`).value) || 0,
                DocName: docName.value,
                DocDate: docDate,
                DocVersion: document.getElementById(`docVersion${i}`).value,
                DocActive: document.getElementById(`docActive${i}`).value === 'true',
                Notes: document.getElementById(`docNotes${i}`).value,
                CompanyId: 1,
                SiteId: 1,
                Active: true,
                UserName: 1
            });
        }
    }

    // Get volunteer ID
    const volunteerId = document.getElementById('volunteerId').value;
    console.log('Volunteer ID from hidden field:', volunteerId);

    // Add volunteer ID to general data
    volunteerData.VolunteerGeneralData[0].VolunteerId = parseInt(volunteerId);
    console.log('VolunteerId set to:', volunteerData.VolunteerGeneralData[0].VolunteerId);

    // Add FlagReason only if color is not green
    const isGreen = currentFlagColor.toLowerCase() === 'green' ||
                    currentFlagColor.toLowerCase() === '#00ff00' ||
                    currentFlagColor.toLowerCase() === '#008000';

    if (!isGreen) {
        volunteerData.VolunteerGeneralData[0].FlagReason = document.getElementById('flagReason').value || '';
    } else {
        volunteerData.VolunteerGeneralData[0].FlagReason = ''; // Clear if green
    }

    // Submit via AJAX
    $.ajax({
        type: "POST",
        url: window.location.pathname + '?handler=Update',
        data: JSON.stringify(volunteerData),
        contentType: "application/json",
        headers: {
            'RequestVerificationToken': window._csrfToken,
            'X-CSRF-TOKEN': window._csrfToken
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("XSRF-TOKEN", window._csrfToken);
        },
        success: function (response) {
            console.log('Full Response:', response);
            console.log('Response.success:', response.success);
            console.log('Response.message:', response.message);
            console.log('Response type:', typeof response);

            if (response.success) {
                alert('Volunteer updated successfully!');
                window.location.href = '/VLT/Volunteer/Index';
            } else {
                const errorMsg = response.message || response.Message || 'Unknown error occurred';
                console.error('Error details:', response);
                console.error('Full error message:', errorMsg);
                alert('Error: ' + errorMsg);
            }
        },
        error: function (xhr, status, error) {
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

// Populate form with existing data
if (window.volunteerData) {
    console.log('Loading volunteer data for editing:', window.volunteerData);
    console.log('Type of volunteerData:', typeof window.volunteerData);
    console.log('volunteerData keys:', Object.keys(window.volunteerData));

    // Check if data has the expected structure
    if (window.volunteerData.Header) {
        console.log('Header found:', window.volunteerData.Header);
        console.log('Header keys:', Object.keys(window.volunteerData.Header));
    } else if (window.volunteerData.header) {
        console.log('header (lowercase) found:', window.volunteerData.header);
        console.log('header keys:', Object.keys(window.volunteerData.header));
    } else {
        console.error('No Header or header property found in volunteerData');
    }

    populateFormData();
} else {
    console.error('window.volunteerData is null or undefined');
}

function populateFormData() {
    const data = window.volunteerData;

    console.log('populateFormData called with data:', data);
    console.log('data is null?', data === null);
    console.log('data is undefined?', data === undefined);

    if (!data) {
        console.error('volunteerData is null or undefined in populateFormData');
        return;
    }

    // Handle both lowercase and uppercase property names (API returns camelCase)
    const header = data.header || data.Header;

    console.log('Extracted header:', header);

    if (!header) {
        console.error('No header data found in volunteer data');
        console.error('Available properties:', Object.keys(data));
        return;
    }

    // Populate general information - API returns camelCase
    document.getElementById('flag').value = header.flag || 0;
    document.getElementById('flagReason').value = header.flagReason || '';

    // Store flag color from loaded data
    currentFlagColor = header.flagColor || '';

    document.getElementById('firstName').value = header.firstName || '';
    document.getElementById('middleName').value = header.middleName || '';
    document.getElementById('lastName').value = header.lastName || '';

    // Parse date from format "MM/DD/YYYY HH:mm:ss" to "MM/DD/YYYY" for text input
    let dobValue = '';
    if (header.subjectDOB) {
        const dobParts = header.subjectDOB.split(' ')[0].split('/');
        if (dobParts.length === 3) {
            // Keep in MM/DD/YYYY format for text input
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

    // Use the ID fields returned from the API
    document.getElementById('sex').value = header.sexId || '';
    document.getElementById('gender').value = header.genderId || '';
    document.getElementById('race').value = header.raceId || '';
    document.getElementById('ethnicity').value = header.ethnicityId || '';
    document.getElementById('language').value = header.languageId || '';
    document.getElementById('currentStatus').value = header.currentStatusId || '';

    // Populate address
    volunteerAddressId = header.addressId || 0; // Store addressId for update
    document.getElementById('address1').value = header.address1 || '';
    document.getElementById('address2').value = header.address2 || '';
    document.getElementById('city').value = header.city || '';
    document.getElementById('state').value = header.state || '';
    document.getElementById('zipCode').value = header.zipCode || '';
    document.getElementById('country').value = header.country || '';
    document.getElementById('legalRepresentative').value = header.legalRepresentative || '';

    // Helper function to parse date from "MM/DD/YYYY HH:mm:ss" to "YYYY-MM-DD"
    function parseDate(dateStr) {
        if (!dateStr) return '';
        const dateParts = dateStr.split(' ')[0].split('/');
        if (dateParts.length === 3) {
            // Check if it's the min date (01/01/0001)
            if (dateParts[2] === '0001') return '';
            return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
        }
        return '';
    }

    // Populate emergency contacts
    const emergencyContacts = data.emergencyContacts || [];
    if (emergencyContacts.length > 0) {
        emergencyContacts.forEach(contact => {
            addEmergencyContact();
            const currentCounter = emergencyContactCounter;

            // Store the contact ID for update
            const contactRecordId = document.getElementById(`contactRecordId${currentCounter}`);
            if (contactRecordId && contact.emergencyContactId) {
                contactRecordId.value = contact.emergencyContactId;
            }

            document.getElementById(`contactName${currentCounter}`).value = contact.contactName || '';
            document.getElementById(`contactPhone${currentCounter}`).value = contact.contactPhone || '';
            document.getElementById(`contactRelation${currentCounter}`).value = contact.relationTypeId || '0';
        });
    }

    // Populate allergies using grid-based approach
    const allergies = data.allergies || [];
    allergiesData = []; // Clear existing data
    if (allergies.length > 0) {
        allergies.forEach(allergy => {
            const allergyItem = {
                id: allergy.allergyId,
                name: allergy.allergy || '',
                startDate: allergy.startDate || '0001-01-01',
                endDate: allergy.endDate || '0001-01-01',
                active: true,
                recordId: allergy.volunteerAllergyId || 0
            };
            allergiesData.push(allergyItem);
        });
    }

    // Populate diseases using grid-based approach
    const diseases = data.diseases || [];
    diseasesData = []; // Clear existing data
    if (diseases.length > 0) {
        diseases.forEach(disease => {
            const diseaseItem = {
                id: disease.diseaseId,
                name: disease.diseaseName || '',
                startDate: disease.startDate || '0001-01-01',
                endDate: disease.endDate || '0001-01-01',
                active: true,
                recordId: disease.volunteerDiseaseId || 0
            };
            diseasesData.push(diseaseItem);
        });
    }

    // Populate medications using grid-based approach
    const medications = data.medications || [];
    medicationsData = []; // Clear existing data
    if (medications.length > 0) {
        medications.forEach(med => {
            // Try to get medication name from medicationList if not available
            let medName = med.drogName || '';
            if (!medName && med.medicationId && window.medicationList) {
                const medItem = window.medicationList.find(m => m.value == med.medicationId);
                medName = medItem ? medItem.text : '';
            }

            const medicationItem = {
                id: med.medicationId,
                name: medName,
                dose: med.drogDose || '',
                startDate: med.startDate || '0001-01-01',
                endDate: med.endDate || '0001-01-01',
                active: true,
                recordId: med.volunteerMedicationId || 0
            };
            medicationsData.push(medicationItem);
        });
    }

    // Populate documents
    const documentations = data.documentations || [];
    if (documentations.length > 0) {
        documentations.forEach(doc => {
            addDocument();
            const currentCounter = documentCounter;

            // Store the document ID for update
            const documentRecordId = document.getElementById(`documentRecordId${currentCounter}`);
            if (documentRecordId && doc.docId) {
                documentRecordId.value = doc.docId;
            }

            document.getElementById(`documentTypeId${currentCounter}`).value = doc.docTypeId || '0';
            document.getElementById(`docName${currentCounter}`).value = doc.docName || '';
            document.getElementById(`docDate${currentCounter}`).value = parseDate(doc.docDate);
            document.getElementById(`docVersion${currentCounter}`).value = doc.docVersion || '';
            document.getElementById(`docActive${currentCounter}`).value = doc.docActive ? 'true' : 'false';
            document.getElementById(`docNotes${currentCounter}`).value = doc.notes || '';
        });
    }
}

// ========== Grid-Based Medical Information (Steps 5-7) ==========

// Load Allergies Dropdown
function loadAllergiesDropdown() {
    const select = $('#allergySelect');
    select.empty();
    select.append('<option value="">Select Allergy</option>');
    if (window.allergyList && window.allergyList.length > 0) {
        window.allergyList.forEach(allergy => {
            select.append($('<option>', {
                value: allergy.value,
                text: allergy.text
            }));
        });
    }
}

// Setup Allergies Grid
function setupAllergiesGrid() {
    const gridOptions = {
        rowData: allergiesData.filter(item => item.active !== false),
        columnDefs: [
            { field: "id", hide: true },
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
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a href="javascript:void(0)" onclick="deleteAllergy(${params.node.rowIndex})" class="text-danger" title="Delete allergy">
                            <i class="bi bi-trash fs-5"></i>
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'autoHeight'
    };

    const gridDiv = document.querySelector('#allergiesGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        allergiesGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
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
        endDate: endDate || '0001-01-01',
        active: true,
        recordId: 0
    };

    // Check if already exists (only check active items)
    if (allergiesData.some(a => a.id === allergyItem.id && a.active !== false)) {
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
    // Mark as inactive instead of removing from array
    const activeAllergies = allergiesData.filter(item => item.active !== false);
    if (activeAllergies[index]) {
        activeAllergies[index].active = false;
    }
    setupAllergiesGrid();
}

// Load Diseases Dropdown
function loadDiseasesDropdown() {
    const select = $('#diseaseSelect');
    select.empty();
    select.append('<option value="">Select Disease</option>');
    if (window.diseaseList && window.diseaseList.length > 0) {
        window.diseaseList.forEach(disease => {
            select.append($('<option>', {
                value: disease.value,
                text: disease.text
            }));
        });
    }
}

// Setup Diseases Grid
function setupDiseasesGrid() {
    const gridOptions = {
        rowData: diseasesData.filter(item => item.active !== false),
        columnDefs: [
            { field: "id", hide: true },
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
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a href="javascript:void(0)" onclick="deleteDisease(${params.node.rowIndex})" class="text-danger" title="Delete disease">
                            <i class="bi bi-trash fs-5"></i>
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'autoHeight'
    };

    const gridDiv = document.querySelector('#diseasesGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        diseasesGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
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
        endDate: endDate || '0001-01-01',
        active: true,
        recordId: 0
    };

    // Check if already exists (only check active items)
    if (diseasesData.some(d => d.id === diseaseItem.id && d.active !== false)) {
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
    // Mark as inactive instead of removing from array
    const activeDiseases = diseasesData.filter(item => item.active !== false);
    if (activeDiseases[index]) {
        activeDiseases[index].active = false;
    }
    setupDiseasesGrid();
}

// Load Medications Dropdown
function loadMedicationsDropdown() {
    const select = $('#medicationSelect');
    select.empty();
    select.append('<option value="">Select Medication</option>');
    if (window.medicationList && window.medicationList.length > 0) {
        window.medicationList.forEach(medication => {
            select.append($('<option>', {
                value: medication.value,
                text: medication.text
            }));
        });
    }
}

// Setup Medications Grid
function setupMedicationsGrid() {
    const gridOptions = {
        rowData: medicationsData.filter(item => item.active !== false),
        columnDefs: [
            { field: "id", hide: true },
            { field: "name", headerName: "Medication", flex: 2 },
            { field: "dose", headerName: "Dose", flex: 1 },
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
            },
            {
                headerName: "Actions",
                flex: 1,
                cellRenderer: function (params) {
                    return `
                        <a href="javascript:void(0)" onclick="deleteMedication(${params.node.rowIndex})" class="text-danger" title="Delete medication">
                            <i class="bi bi-trash fs-5"></i>
                        </a>
                    `;
                }
            }
        ],
        domLayout: 'autoHeight'
    };

    const gridDiv = document.querySelector('#medicationsGrid');
    if (gridDiv) {
        gridDiv.innerHTML = '';
        medicationsGridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

// Save Medication
function saveMedication() {
    const medicationId = $('#medicationSelect').val();
    const dose = $('#medicationDose').val();
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
        dose: dose || '',
        startDate: startDate || '0001-01-01',
        endDate: endDate || '0001-01-01',
        active: true,
        recordId: 0
    };

    // Check if already exists (only check active items)
    if (medicationsData.some(m => m.id === medicationItem.id && m.active !== false)) {
        $('#validateMedication').text('This medication is already added');
        return;
    }

    // Add new
    medicationsData.push(medicationItem);
    setupMedicationsGrid();

    // Reset form
    $('#medicationSelect').val('');
    $('#medicationDose').val('');
    $('#medicationStartDate').val('');
    $('#medicationEndDate').val('');
}

// Delete Medication
function deleteMedication(index) {
    if (!confirm('Are you sure you want to remove this medication?')) {
        return;
    }
    // Mark as inactive instead of removing from array
    const activeMedications = medicationsData.filter(item => item.active !== false);
    if (activeMedications[index]) {
        activeMedications[index].active = false;
    }
    setupMedicationsGrid();
}
