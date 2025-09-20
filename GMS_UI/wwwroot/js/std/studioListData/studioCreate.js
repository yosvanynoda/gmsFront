﻿let currentStep = 1;
const totalSteps = 4;

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
        currentIndicator.innerHTML = '<i class="fas fa-check"></i>';

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

function updateReviewSummary() {
    const summary = document.getElementById('reviewSummary');
    const studyTitle = document.querySelector('[name="StudyTitle"]').value;
    const studyPhase = document.querySelector('[name="StudyPhase"]').value;
    const studyType = document.querySelector('[name="StudyType"]').value;
    const principalInvestigator = document.querySelector('[name="PrincipalInvestigator"]').value;
    const targetEnrollment = document.querySelector('[name="TargetEnrollment"]').value;
    const sponsorName = document.querySelector('[name="SponsorName"]').value;

    summary.innerHTML = `
            <strong>Study Title:</strong> ${studyTitle}<br>
            <strong>Phase:</strong> ${studyPhase}<br>
            <strong>Type:</strong> ${studyType}<br>
            <strong>Principal Investigator:</strong> ${principalInvestigator}<br>
            <strong>Target Enrollment:</strong> ${targetEnrollment} participants<br>
            <strong>Sponsor:</strong> ${sponsorName}
        `;
}

// Initialize navigation buttons
updateNavigationButtons();