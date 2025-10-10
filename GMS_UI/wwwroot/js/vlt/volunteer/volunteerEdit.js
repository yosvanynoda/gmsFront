let currentStep = 1;
const totalSteps = 6;

// Counters for dynamic lists
let emergencyContactCounter = 0;
let allergyCounter = 0;
let diseaseCounter = 0;
let medicationCounter = 0;
let documentCounter = 0;

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

    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
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
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            MiddleName: document.getElementById('middleName').value,
            SubjectDOB: document.getElementById('subjectDOB').value,
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
        VolunteerDiseaseData: [],
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

    // Collect allergies
    for (let i = 1; i <= allergyCounter; i++) {
        const allergyId = document.getElementById(`allergyId${i}`);
        if (allergyId && allergyId.value) {
            const startDate = document.getElementById(`allergyStartDate${i}`).value || '0001-01-01';
            const endDate = document.getElementById(`allergyEndDate${i}`).value || '0001-01-01';
            volunteerData.VolunteerAllergyData.push({
                AllergyId: parseInt(allergyId.value),
                StartDate: startDate,
                EndDate: endDate,
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        }
    }

    // Collect diseases
    for (let i = 1; i <= diseaseCounter; i++) {
        const diseaseId = document.getElementById(`diseaseId${i}`);
        if (diseaseId && diseaseId.value) {
            const startDate = document.getElementById(`diseaseStartDate${i}`).value || '0001-01-01';
            const endDate = document.getElementById(`diseaseEndDate${i}`).value || '0001-01-01';
            volunteerData.VolunteerDiseaseData.push({
                DiseaseId: parseInt(diseaseId.value),
                StartDate: startDate,
                EndDate: endDate,
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        }
    }

    // Collect medications
    for (let i = 1; i <= medicationCounter; i++) {
        const medicationName = document.getElementById(`medicationName${i}`);
        if (medicationName && medicationName.value) {
            const startDate = document.getElementById(`medicationStartDate${i}`).value || '0001-01-01';
            const endDate = document.getElementById(`medicationEndDate${i}`).value || '0001-01-01';
            volunteerData.VolunteerMedicationData.push({
                DrogName: medicationName.value,
                DrogDose: document.getElementById(`medicationDose${i}`).value,
                StartDate: startDate,
                EndDate: endDate,
                CompanyId: 1,
                SiteId: 1,
                Active: true
            });
        }
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

    // Get volunteer ID
    const volunteerId = document.getElementById('volunteerId').value;

    // Add volunteer ID to general data
    volunteerData.VolunteerGeneralData[0].VolunteerId = parseInt(volunteerId);

    // Submit via AJAX
    console.log('Updating volunteer data:', volunteerData);
    console.log('URL:', window.location.pathname + '?handler=Update');
    console.log('CSRF Token:', window._csrfToken);

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
    document.getElementById('firstName').value = header.firstName || '';
    document.getElementById('middleName').value = header.middleName || '';
    document.getElementById('lastName').value = header.lastName || '';

    // Parse date from format "MM/DD/YYYY HH:mm:ss" to "YYYY-MM-DD"
    let dobValue = '';
    if (header.subjectDOB) {
        const dobParts = header.subjectDOB.split(' ')[0].split('/');
        if (dobParts.length === 3) {
            dobValue = `${dobParts[2]}-${dobParts[0].padStart(2, '0')}-${dobParts[1].padStart(2, '0')}`;
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

    // Populate address
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
            document.getElementById(`contactName${emergencyContactCounter}`).value = contact.contactName || '';
            document.getElementById(`contactPhone${emergencyContactCounter}`).value = contact.contactPhone || '';
            document.getElementById(`contactRelation${emergencyContactCounter}`).value = contact.relationTypeId || '0';
        });
    }

    // Populate allergies
    const allergies = data.allergies || [];
    if (allergies.length > 0) {
        allergies.forEach(allergy => {
            addAllergy();
            document.getElementById(`allergyId${allergyCounter}`).value = allergy.allergyId || '';
            document.getElementById(`allergyStartDate${allergyCounter}`).value = parseDate(allergy.startDate);
            document.getElementById(`allergyEndDate${allergyCounter}`).value = parseDate(allergy.endDate);
        });
    }

    // Populate diseases
    const diseases = data.diseases || [];
    if (diseases.length > 0) {
        diseases.forEach(disease => {
            addDisease();
            document.getElementById(`diseaseId${diseaseCounter}`).value = disease.diseaseId || '';
            document.getElementById(`diseaseStartDate${diseaseCounter}`).value = parseDate(disease.startDate);
            document.getElementById(`diseaseEndDate${diseaseCounter}`).value = parseDate(disease.endDate);
        });
    }

    // Populate medications
    const medications = data.medications || [];
    if (medications.length > 0) {
        medications.forEach(med => {
            addMedication();
            document.getElementById(`medicationName${medicationCounter}`).value = med.drogName || '';
            document.getElementById(`medicationDose${medicationCounter}`).value = med.drogDose || '';
            document.getElementById(`medicationStartDate${medicationCounter}`).value = parseDate(med.startDate);
            document.getElementById(`medicationEndDate${medicationCounter}`).value = parseDate(med.endDate);
        });
    }

    // Populate documents
    const documentations = data.documentations || [];
    if (documentations.length > 0) {
        documentations.forEach(doc => {
            addDocument();
            document.getElementById(`documentTypeId${documentCounter}`).value = doc.docTypeId || '0';
            document.getElementById(`docName${documentCounter}`).value = doc.docName || '';
            document.getElementById(`docDate${documentCounter}`).value = parseDate(doc.docDate);
            document.getElementById(`docVersion${documentCounter}`).value = doc.docVersion || '';
            document.getElementById(`docActive${documentCounter}`).value = doc.docActive ? 'true' : 'false';
            document.getElementById(`docNotes${documentCounter}`).value = doc.notes || '';
        });
    }
}
